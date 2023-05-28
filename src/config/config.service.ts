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
        })

        environmentVariablesSchema.parse(this)
    }

    get port(): number | string {
        return this.envCache.PORT || 8080
    }

    get WHOIS_KEY(): string {
        return this.envCache.WHOIS_KEY || ''
    }
}
