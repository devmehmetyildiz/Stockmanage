import rateLimit from 'express-rate-limit';
import { Injectable, NestMiddleware } from '@nestjs/common';
//TODO mesaj eng tr olmalı
@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
    private limiter = rateLimit({
        windowMs: 60 * 1000, // 1 dakika
        max: 60 * 20,             // 1 dakika içinde max 10 istek
        message: 'Çok fazla istek yaptınız, lütfen biraz bekleyin.',
    });

    use = this.limiter;
}
