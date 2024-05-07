import { Controller, Post, Body } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';

@Controller()
export class AppController {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  @Post('/publish-message')
  async publishMessages(@Body() body: any) {
    const { count, payload } = body;
    await this.rabbitMQService.publishMessage({
      type: 'EdgeCreated',
      payload: {
        ...payload,
      },
    });

    return { status: 'Messages published', count };
  }
}
