import { OnQueueActive, Process, Processor } from '@nestjs/bull'
import { Inject, Logger } from '@nestjs/common'
import { Job } from 'bull'
import axios from 'axios'

@Processor('domains')
export class DomainsProcessor {
    private readonly logger = new Logger(DomainsProcessor.name)
    @OnQueueActive()
    onActive(job: Job) {
        this.logger.log(`Processing job ${job.id} of type ${job.name}.`)
    }
    @Process('fetch_data')
    async FetchDomainData(job: Job) {
        console.log(job.data)
        const { data } = job.data
        this.logger.log(`Updated the data for Domain: ${data.domain}.`)
    }
}
