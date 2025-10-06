import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import config from 'src/config';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {

        const isAuthUrl = req.originalUrl.startsWith("/Auth/")
        if (isAuthUrl) {
            next()
            return
        }
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(400).json({
                type: "VALIDATION",
                code: "VALIDATION_FAILED",
                description: "Validation failed. Look in list property for details",
                list: [
                    {
                        description: "tr",
                        fulldescription: {
                            code: "AUTHORIZATION_HEADER_REQUIRED",
                            description: {
                                en: "You need to provide authorization headers to access this resource",
                                tr: "Bu kaynağa erişmek için yetkilendirme başlıkları gerekiyor"
                            }
                        },
                        type: "VALIDATION ITEM",
                        code: "tr"
                    }
                ]
            })
        }

        const token = authHeader.split(' ')[1];

        try {
            const tokenResponse = await axios.post(`${config.services.Auth}Oauth/ValidateToken`, {
                accessToken: token,
            });

            const tokenData = tokenResponse.data;

            (req as any).user = tokenData?.Username ?? 'Undefined User'

            next();
        } catch (error) {
            return res.status(error?.response?.status).json(error?.response?.data)
        }
    }
}
