import { Process, Processor } from '@nestjs/bull'
import { Inject, Logger } from '@nestjs/common'
import { Job } from 'bull'
import axios from 'axios'
import { PrismaService } from '../prisma.service'

@Processor('domains')
export class DomainsProcessor {
    @Inject(PrismaService) private readonly prisma!: PrismaService
    private readonly logger = new Logger(DomainsProcessor.name)
    @Process('fetch_data')
    async FetchDomainData(job: Job) {
        try {
            const { domain } = job.data
            const WHOIS_res = await axios.get(
                `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_aTJ2tR0PqCY8vTyqKvxqLvGnMVbSK&domainName=${domain}&outputFormat=JSON`
            )
            await this.prisma.domains.upsert({
                where: {
                    domain: domain,
                },
                update: {
                    virusTotal_Data: {},
                    WHOIS_Data: WHOIS_res.data,
                    lastScanned: new Date(),
                },
                create: {
                    domain: domain,
                    virusTotal_Data: {},
                    WHOIS_Data: WHOIS_res?.data?.WhoisRecord || {},
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
