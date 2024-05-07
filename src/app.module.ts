import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphqlModule } from './graphql/graphql.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { EdgesModule } from './edges/edges.module';

@Module({
  imports: [
    EdgesModule,
    GraphqlModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    RabbitMQModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
