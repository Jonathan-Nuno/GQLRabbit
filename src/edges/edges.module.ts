import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Edge } from './entities/edge.entity';
import { EdgesService } from './edges.service';
import { EdgesResolver } from './edges.resolver';
import { EdgesController } from './edges.controller';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';

@Module({
  imports: [TypeOrmModule.forFeature([Edge]), RabbitMQModule],
  controllers: [EdgesController],
  providers: [EdgesService, EdgesResolver],
})
export class EdgesModule {}
