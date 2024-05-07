import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edge } from './entities/edge.entity';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { EdgeDTO } from './dto/edge.dto';

@Injectable()
export class EdgesService {
  private readonly logger = new Logger(EdgesService.name);

  constructor(
    @InjectRepository(Edge)
    private edgesRepository: Repository<Edge>,
    private rabbitMQService: RabbitMQService,
  ) {}

  onModuleInit() {
    this.startListeningToMessages();
  }

  async findAll(): Promise<EdgeDTO[]> {
    try {
      const edges = await this.edgesRepository.find();
      return edges.map((edge) => this.toDTO(edge));
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve edges');
    }
  }

  async findOne(id: string): Promise<EdgeDTO> {
    try {
      const edge = await this.edgesRepository.findOne({ where: { id } });
      if (!edge) {
        throw new NotFoundException(`Edge with ID ${id} not found`);
      }
      return this.toDTO(edge);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to find edge with ID ${id}`,
      );
    }
  }

  async create(edgeData: Partial<Edge>): Promise<EdgeDTO> {
    try {
      const edge = this.edgesRepository.create(edgeData);
      const savedEdge = await this.edgesRepository.save(edge);
      if (!edgeData.processed) {
        await this.rabbitMQService.publishMessage({
          type: 'EdgeCreated',
          payload: { ...savedEdge, processed: true },
        });
      }
      return this.toDTO(savedEdge);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create an edge: ${error.detail || error.message}`,
      );
    }
  }

  private async startListeningToMessages() {
    this.rabbitMQService.subscribeToQueue(
      'edge-creation-queue',
      async (msg) => {
        try {
          const messageData = JSON.parse(msg.content.toString());
          const edgeData = messageData.payload;
          this.logger.log(`Processing message: ${JSON.stringify(messageData)}`);

          const edge = await this.edgesRepository.findOne({
            where: { id: edgeData.id },
          });
          if (!edge) {
            this.logger.error(`Edge with ID ${edgeData.id} not found`);
            return false;
          }

          edge.node1Alias = `${edgeData.node1Alias}-updated`;
          edge.node2Alias = `${edgeData.node2Alias}-updated`;
          await this.edgesRepository.save(edge);
          this.logger.log(
            `New channel between [${edge.node1Alias}] and [${edge.node2Alias}] with a capacity of [${edge.capacity}] has been created.`,
          );
          return true;
        } catch (error) {
          this.logger.error('Error processing edge creation message:', error);
          return false;
        }
      },
    );
  }

  private toDTO(edge: Edge): EdgeDTO {
    return {
      id: edge.id,
      createdAt: edge.createdAt,
      updatedAt: edge.updatedAt,
      capacity: edge.capacity,
      node1Alias: edge.node1Alias,
      node2Alias: edge.node2Alias,
      edgePeers: `[${edge.node1Alias}]-[${edge.node2Alias}]`,
    };
  }
}
