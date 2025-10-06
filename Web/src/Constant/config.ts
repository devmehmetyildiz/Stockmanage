import Changelogs from "@Pages/About/Changelogs"

interface ConfigType {
    env: string
    port: string
    version: string
    session: {
        name: string
    }
    business: {
        organization: string
    }
    backendUrl: string
}

const config: ConfigType = {
    env: import.meta.env.VITE_ENV ?? '',
    port: import.meta.env.VITE_PUBLIC_PORT ?? '',
    version: Changelogs[0].version ?? '',
    session: {
        name: import.meta.env.VITE_SESSION_NAME ?? '',
    },
    business: {
        organization: import.meta.env.VITE_ORGANIZATION_NAME ?? ''
    },
    backendUrl: import.meta.env.VITE_ENV === 'development'
        ? import.meta.env.VITE_BACKEND_URL_DEV
        : import.meta.env.VITE_BACKEND_URL_PROD
}

export default config