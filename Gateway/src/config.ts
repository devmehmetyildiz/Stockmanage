import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

interface ConfigType {
    env: string
    port: string
    session: {
        domain: string,
        name: string
        secret: string
    }
    message: {
        username: string,
        password: string,
        port: string,
    },
    corsdomains: string[]
    services: {
        Auth: string
        Business: string
        Setting: string
        System: string
        Userrole: string
        Warehouse: string
        Log: string
        File: string
        Web: string
    }
}

const config: ConfigType = {
    env: process.env.APP_ENV ?? '',
    port: process.env.APP_PORT ?? '',
    corsdomains: (process.env.CORS_DOMAINS ?? '').split(',').filter(domain => domain.trim() !== ''),
    services: {
        Auth: process.env.AUTH_URL ?? '',
        Business: process.env.BUSINESS_URL ?? '',
        Setting: process.env.SETTING_URL ?? '',
        System: process.env.SYSTEM_URL ?? '',
        Userrole: process.env.USERROLE_URL ?? '',
        Warehouse: process.env.WAREHOUSE_URL ?? '',
        File: process.env.FILE_URL ?? '',
        Log: process.env.LOG_URL ?? '',
        Web: process.env.WEB_URL ?? '',
    },
    message: {
        username: process.env.APP_MQ_USERNAME ?? '',
        password: process.env.APP_MQ_PASSWORD ?? '',
        port: process.env.APP_MQ_PORT ?? '',
    },
    session: {
        domain: process.env.APP_SESSION_DOMAIN ?? '',
        name: process.env.APP_SESSION_NAME ?? '',
        secret: process.env.APP_SESSION_SECRET ?? '',
    }
}

export default config