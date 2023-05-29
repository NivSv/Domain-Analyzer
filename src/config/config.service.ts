import { Injectable } from '@nestjs/common'
import { config } from 'dotenv'
import { expand } from 'dotenv-expand'
import { z } from 'nestjs-zod/z'

@Injectable()
export class ConfigService {
    private envCache: NodeJS.ProcessEnv

    constructor() {
        expand(config())
        this.envCache = process.env

        const environmentVariablesSchema = z.object({
            port: z.number().or(z.string()),
            WHOIS_KEY: z.string(),
            VIRUS_TOTAL_KEY: z.string(),
            SCHEDULING_ANALYSIS_CRON: z.string(),
            REDIS_HOST: z.string(),
        })

        environmentVariablesSchema.parse(this)
    }

    get port(): number | string {
        return this.envCache.PORT || 8080
    }

    get WHOIS_KEY(): string {
        return this.envCache.WHOIS_KEY || ''
    }

    get VIRUS_TOTAL_KEY(): string {
        return this.envCache.VIRUS_TOTAL_KEY || ''
    }

    get SCHEDULING_ANALYSIS_CRON(): string {
        return this.envCache.SCHEDULING_ANALYSIS_CRON || '0 0 1 * * *' // Every first day of the month.
    }

    get REDIS_HOST(): string {
        return this.envCache.REDIS_HOST || 'localhost'
    }
}
