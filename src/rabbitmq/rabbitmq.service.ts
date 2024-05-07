import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import {
  connect,
  ChannelWrapper,
  AmqpConnectionManager,
} from 'amqp-connection-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connectionManager: AmqpConnectionManager;
  private channelWrapper: ChannelWrapper;

  constructor(private configService: ConfigService) {
    const rabbitUrl = this.configService.get<string>(
      'RABBITMQ_URL',
      'amqp://localhost',
    );
    this.connectionManager = connect([rabbitUrl], {
      reconnectTimeInSeconds: 5,
    });
    this.channelWrapper = this.connectionManager.createChannel({
      json: true,
      setup: async (channel) => {
        await channel.assertQueue('edge-creation-queue', { durable: true });
      },
    });
  }

  async onModuleInit() {
    await this.channelWrapper.waitForConnect();
    this.logger.log('Connected to RabbitMQ');
  }

  async onModuleDestroy() {
    await this.connectionManager.close();
    this.logger.log('Disconnected from RabbitMQ');
  }

  async publishMessage(message: object) {
    try {
      await this.channelWrapper.sendToQueue('edge-creation-queue', message);
      this.logger.log('Message sent:', JSON.stringify(message));
    } catch (err) {
      this.logger.error('Message sending error:', err);
    }
  }

  async subscribeToQueue(
    queueName: string,
    callback: (msg: any, channel: any) => Promise<boolean>,
  ) {
    this.channelWrapper.addSetup(async (channel) => {
      await channel.assertQueue(queueName, { durable: true });
      channel.consume(queueName, async (msg) => {
        if (msg) {
          const success = await callback(msg, channel);
          if (success) {
            channel.ack(msg);
          } else {
            channel.nack(msg);
          }
        }
      });
    });
  }
}
