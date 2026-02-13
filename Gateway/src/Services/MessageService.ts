import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';
import config from '../config'

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
    private connection: amqp.Connection;
    private channel: amqp.Channel;
    private readonly exchangeName = `${config.session.domain}.channel`;
    private readonly logger = new Logger(RabbitmqService.name);

    async onModuleInit() {
        try {
            this.connection = await amqp.connect(
                `amqp://${config.message.username}:${config.message.password}@localhost:${config.message.port}`,
            );
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange(this.exchangeName, 'topic', { durable: true });
            this.logger.log('✅ RabbitMQ connection established.');
        } catch (error) {
            this.logger.error('❌ Failed to connect RabbitMQ:', error.message);
            throw error;
        }
    }

    async publishEvent(_routingKey: string, serviceName: string, tableName: string, payload: any) {
        const routingKey = `${_routingKey}.${serviceName}.${tableName}`;
        try {
            if (!this.channel) {
                this.logger.warn('⚠️ Channel not initialized, reconnecting...');
                await this.onModuleInit();
            }

            this.channel.publish(
                this.exchangeName,
                routingKey,
                Buffer.from(JSON.stringify(payload)),
                { persistent: true },
            );

            this.logger.log(`📤 Message published to ${routingKey}`);
        } catch (error) {
            this.logger.error('❌ Failed to publish message:', error.message);
        }
    }

    async onModuleDestroy() {
        await this.channel?.close();
        await this.connection?.close();
        this.logger.log('RabbitMQ connection closed.');
    }
}