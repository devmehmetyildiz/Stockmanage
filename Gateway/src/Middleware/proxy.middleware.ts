import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { NextFunction, Request, Response } from 'express';
import config from 'src/config';
import axios from 'axios';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
    private readonly serviceMap: Record<string, string> = {
        '/Auth': config.services.Auth,
        '/Business': config.services.Business,
        '/Setting': config.services.Setting,
        '/System': config.services.System,
        '/Userrole': config.services.Userrole,
        '/Warehouse': config.services.Warehouse,
        '/Log': config.services.Log,
    };

    private readonly proxies: Record<string, any>;

    constructor() {
        this.proxies = {};
        Object.entries(this.serviceMap).forEach(([prefix, target]) => {
            this.proxies[prefix] = createProxyMiddleware({
                target,
                changeOrigin: true,
                pathRewrite: {
                    [`^${prefix}`]: '',
                },
                selfHandleResponse: false,
                onProxyReq: (proxyReq, req: Request, res: Response) => {
                    proxyReq.setHeader('x-proxied-by', config.session.secret);
                    proxyReq.removeHeader?.('if-none-match');
                    proxyReq.removeHeader?.('if-modified-since');

                    if (
                        req.body &&
                        ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase()) &&
                        req.headers['content-type']?.includes('application/json')
                    ) {
                        const bodyData = JSON.stringify(req.body);
                        proxyReq.setHeader('Content-Type', 'application/json');
                        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                        proxyReq.write(bodyData);
                    }
                },
                on: {
                    error: (err, req: Request, res: Response) => {
                        if (!res.headersSent) {
                            res.writeHead(504, { 'Content-Type': 'application/json' });
                        }
                        res.end(JSON.stringify({ message: 'Proxy Error', error: err.message }));
                    },
                    proxyRes: (proxyRes, httpReq, httpRes) => {



                        const contentType = proxyRes.headers['content-type'] || '';

                        const req = (httpReq as any)
                        const chunks: Buffer[] = [];
                        proxyRes.on('data', (chunk) => chunks.push(chunk));
                        proxyRes.on('end', async () => {
                            let responseString: any;

                            if (contentType.includes('application/json')) {
                                responseString = Buffer.concat(chunks).toString('utf8');
                            } else {
                                responseString = `[Binary data: ${Buffer.concat(chunks).length} bytes, Content-Type: ${contentType}]`;
                            }

                            const logBody = {
                                Service: prefix.replace('/', ''),
                                UserID: req?.user || null,
                                Requesttype: req.method,
                                Requesturl: req.originalUrl,
                                Requestip: req.ip,
                                Status: httpRes?.statusCode?.toString(),
                                Requestdata: JSON.stringify(req.body || req.query || {}),
                                Responsedata: responseString,
                            };
                            if (prefix !== '/Log') {
                                axios.post(`${process.env.LOG_URL}Logs`, logBody, {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'session_key': process.env.APP_SESSION_SECRET,
                                    },
                                }).catch((err) => console.error('Logging failed:', err?.response?.data || err.message))
                            }
                        });
                    }
                },
            } as Options);
        });
    }

    use(req: Request, res: Response, next: NextFunction) {
        req.url = req.originalUrl;

        const matchedPrefix = Object.keys(this.serviceMap).find(prefix =>
            req.originalUrl.startsWith(prefix)
        );

        if (matchedPrefix) {
            return this.proxies[matchedPrefix](req, res, next);
        }

        next();
    }
}
