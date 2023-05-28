import { Inject, Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { Cron } from '@nestjs/schedule'
import { ConfigService } from '../config/config.service'

@Injectable()
export class DomainsService {
    @Inject(PrismaService) private readonly prisma!: PrismaService
    private readonly logger = new Logger(DomainsService.name)

    constructor(@InjectQueue('domains') private readonly domainsQueue: Queue) {}

    async addToDomainsQueue(domain: string) {
        this.domainsQueue.getJobs(['active', 'waiting']).then((jobs) => {
            const job = jobs.find((job) => job.data.domain === domain)
            if (job == null) {
                this.logger.log(`Adding ${domain} to the queue.`)
                this.domainsQueue.add('fetch_data', { domain })
            } else {
                this.logger.warn(`Domain ${domain} is already in the queue.`)
            }
        })
    }

    async getDomainData(domain: string) {
        const domainFound = await this.prisma.domains.findUnique({
            where: {
                domain: domain,
            },
        })
        if (domainFound == null) {
            this.addToDomainsQueue(domain)
        }
        return domainFound
    }

    @Cron(new ConfigService().SCHEDULING_ANALYSIS_CRON) // Every first day of the month at.
    async AnalyzeAllDomains(): Promise<void> {
        this.logger.log('Analyzing all domains.')
        const domains = await this.prisma.domains.findMany()
        domains.forEach((domain) => {
            this.addToDomainsQueue(domain.domain)
        })
    }
}
