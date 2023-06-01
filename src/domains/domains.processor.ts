import {
    OnQueueCompleted,
    OnQueueFailed,
    Process,
    Processor,
} from '@nestjs/bull'
import { Inject, Logger } from '@nestjs/common'
import { Job } from 'bull'
import { PrismaService } from '../prisma.service'
import { ApisService } from '../apis/apis.service'

@Processor('domains')
export class DomainsProcessor {
    @Inject(PrismaService) private readonly prisma!: PrismaService
    @Inject(ApisService) private readonly apisService!: ApisService
    private readonly logger = new Logger(DomainsProcessor.name)

    @OnQueueCompleted()
    async handleQueueCompleted(job: Job) {
        this.logger.log(`Updated the data for Domain: ${job.data.domain}.`)
    }

    @OnQueueFailed()
    async handleQueueFailed(job: Job, error: Error) {
        this.logger.error(
            `Failed to update the data for Domain: ${job.data.domain}.`
        )
        if (error.message.includes('400')) {
            this.logger.error('Invalid domain.')
            return
        }
        if (error.message.includes('404')) {
            this.addToListForFeatureAnalysis(job.data.domain)
            return
        }
        this.logger.error(error)
    }

    @Process('fetch_data')
    async FetchDomainData(job: Job) {
        const { domain } = job.data
        const [whoIsData, virusTotalData] = await Promise.all([
            this.apisService.WhoIsApi(domain),
            this.apisService.VirusTotalApi(domain),
        ])
        await this.prisma.domains.upsert({
            where: {
                domain: domain,
            },
            update: {
                virusTotalData: virusTotalData || {},
                whoIsData: whoIsData || {},
                lastScanned: new Date(),
            },
            create: {
                domain: domain,
                virusTotalData: virusTotalData || {},
                whoIsData: whoIsData || {},
                lastScanned: new Date(),
            },
        })
    }

    async addToListForFeatureAnalysis(domain: string) {
        await this.prisma.domains.upsert({
            where: {
                domain: domain,
            },
            update: {
                virusTotalData: {},
                whoIsData: {},
                lastScanned: new Date(),
            },
            create: {
                domain: domain,
                virusTotalData: {},
                whoIsData: {},
                lastScanned: new Date(),
            },
        })
        this.logger.log(`Added ${domain} to the list for feature analysis.`)
    }
}
