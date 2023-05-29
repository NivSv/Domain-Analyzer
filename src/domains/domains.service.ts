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
        const jobs = await this.domainsQueue.getJobs(['active', 'waiting'])
        const job = jobs.find((job) => job.data.domain === domain)
        if (job == null) {
            this.logger.log(`Adding ${domain} to the queue.`)
            const job = await this.domainsQueue.add('fetch_data', {
                domain,
            })
            return job.id
        } else {
            this.logger.warn(`Domain ${domain} is already in the queue.`)
            return job.id
        }
    }

    async getDomainData(domain: string) {
        let jobId = null
        const domainFound = await this.prisma.domains.findUnique({
            where: {
                domain: domain,
            },
        })
        if (domainFound == null) {
            jobId = await this.addToDomainsQueue(domain)
        }
        return { domainData: domainFound, jobId }
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
