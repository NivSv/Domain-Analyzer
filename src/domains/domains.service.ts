import { Inject, Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import axios from 'axios'
import { Cron } from '@nestjs/schedule'

@Injectable()
export class DomainsService {
    @Inject(PrismaService) private readonly prisma!: PrismaService
    private readonly logger = new Logger(DomainsService.name)

    constructor(@InjectQueue('domains') private readonly domainsQueue: Queue) {}

    async addToDomainQue(domain: string) {
        await this.domainsQueue.add('fetch_data', domain)
    }

    async getDomainData(domain: string) {
        const domainFound = await this.prisma.domains.findUnique({
            where: {
                domain: domain,
            },
        })
        if (domainFound == null) {
            this.addToDomainQue(domain)
        }
        return domainFound
    }

    @Cron('0 0 1 * * *') // Every first day of the month at.
    async AnalyzeAllDomains(): Promise<void> {
        this.logger.log('Analyzing all domains.')
        const domains = await this.prisma.domains.findMany()
        domains.forEach((domain) => {
            this.addToDomainQue(domain.domain)
        })
    }
}
