import { Process, Processor } from '@nestjs/bull'
import { Inject, Logger } from '@nestjs/common'
import { Job } from 'bull'
import axios from 'axios'

@Processor('domains')
export class DomainsProcessor {
    @Inject(Logger) private readonly logger!: Logger
    @Process('fetch_data')
    async FetchDomainData(job: Job) {
        const { data } = job.data
        const response = await axios.get(data)
        this.logger.log(`Updated the data for Domain: ${data.domain}.`)
    }
}
