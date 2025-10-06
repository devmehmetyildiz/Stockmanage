import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

@Injectable()
export class LogMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        let responseBody: any;

        const oldSend = res.send;
        (res as any).send = function (body: any) {
            responseBody = body;
            return oldSend.call(this, body);
        };

        const oldJson = res.json;
        (res as any).json = function (body: any) {
            responseBody = body;
            return oldJson.call(this, body);
        };

        res.on('finish', async () => {
            try {
                const logData = {
                    Service: 'gateway',
                    UserID: (req as any)?.user || null,
                    Requesttype: req.method,
                    Requesturl: req.originalUrl,
                    Requestip: req.ip,
                    Status: res.statusCode.toString(),
                    Requestdata: JSON.stringify(req.body || {}),
                    Responsedata: responseBody
                        ? (typeof responseBody === 'object'
                            ? JSON.stringify(responseBody)
                            : responseBody.toString())
                        : null,
                };

                await axios.post(`${process.env.LOG_URL}Logs`, logData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'session_key': process.env.APP_SESSION_SECRET,
                    },
                });
            } catch (err: any) {
                console.error('Log gönderilemedi:', err.message);
            }
        });

        next();
    }
}
