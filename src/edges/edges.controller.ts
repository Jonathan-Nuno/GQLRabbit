import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { EdgesService } from './edges.service';
import { CreateEdgeDto } from './dto/create-edge.dto';
import { Edge } from './entities/edge.entity';

@Controller('edges')
export class EdgesController {
  constructor(private readonly edgesService: EdgesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEdgeDto: CreateEdgeDto): Promise<Edge> {
    return this.edgesService.create(createEdgeDto);
  }

  @Get()
  async findAll(): Promise<Edge[]> {
    return this.edgesService.findAll();
  }

  @Get(':id')
  async getEdgeById(@Param('id') id: string) {
    const edge = await this.edgesService.findOne(id);
    if (!edge) {
      throw new NotFoundException(`Edge with ID ${id} not found`);
    }
    return edge;
  }
}
