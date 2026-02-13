import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TokenMiddleware } from './Middleware/token.middleware';
import { RateLimitMiddleware } from './Middleware/rate-limit.middleware';
import { ProxyMiddleware } from './Middleware/proxy.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitmqService } from './Services/MessageService';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [RabbitmqService, AppService],
  exports: [RabbitmqService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes('*');

    consumer
      .apply(TokenMiddleware)
      .forRoutes('*');

    consumer
      .apply(ProxyMiddleware)
      .forRoutes('*');
   
  }
}
