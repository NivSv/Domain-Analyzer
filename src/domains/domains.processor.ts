import { Process, Processor } from '@nestjs/bull'
import { Inject, Logger } from '@nestjs/common'
import { Job } from 'bull'
import { PrismaService } from '../prisma.service'
import { VirusTotalApi, WhoIsApi } from '../dataServices'

@Processor('domains')
export class DomainsProcessor {
    @Inject(PrismaService) private readonly prisma!: PrismaService
    private readonly logger = new Logger(DomainsProcessor.name)
    @Process('fetch_data')
    async FetchDomainData(job: Job) {
        try {
            const { domain } = job.data
            const whoIsData = await WhoIsApi(domain)
            const virusTotalData = await VirusTotalApi(domain)
            await this.prisma.domains.upsert({
                where: {
                    domain: domain,
                },
                update: {
                    virusTotal_Data: virusTotalData || {},
                    WHOIS_Data: whoIsData || {},
                    lastScanned: new Date(),
                },
                create: {
                    domain: domain,
                    virusTotal_Data: virusTotalData || {},
                    WHOIS_Data: whoIsData || {},
                    lastScanned: new Date(),
                },
            })
            this.logger.log(`Updated the data for Domain: ${domain}.`)
        } catch (error) {
            this.logger.error(`Error while updating the doing data analysis.`)
            this.logger.error(error)
        }
    }
}
