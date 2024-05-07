import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EdgeDTO } from './dto/edge.dto';
import { EdgesService } from './edges.service';
import { CreateEdgeInput } from './dto/create-edge.input';

@Resolver(() => EdgeDTO)
export class EdgesResolver {
  constructor(private edgesService: EdgesService) {}

  @Query(() => [EdgeDTO])
  async getEdges(): Promise<EdgeDTO[]> {
    try {
      return await this.edgesService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve edges');
    }
  }

  @Query(() => EdgeDTO)
  async getEdge(@Args('id') id: string): Promise<EdgeDTO> {
    const edge = await this.edgesService.findOne(id);
    if (!edge) {
      throw new NotFoundException(`Edge with ID ${id} not found`);
    }
    return edge;
  }

  @Mutation(() => EdgeDTO)
  async createEdge(
    @Args('createEdgeInput') createEdgeInput: CreateEdgeInput,
  ): Promise<EdgeDTO> {
    try {
      return await this.edgesService.create(createEdgeInput);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create edge');
    }
  }
}
