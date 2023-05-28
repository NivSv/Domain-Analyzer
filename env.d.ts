declare namespace NodeJS {
    export interface ProcessEnv {
        PORT?: number
        DATABASE_URL: string
        WHOIS_KEY: string
    }
}
