declare namespace NodeJS {
    export interface ProcessEnv {
        PORT?: number
        DATABASE_URL: string
        WHOIS_KEY: string
        VIRUS_TOTAL_KEY: string
        SCHEDULING_ANALYSIS_CRON: string
    }
}
