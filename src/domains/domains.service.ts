import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'

@Injectable()
export class DomainsService {
    @Inject(PrismaService) private readonly prisma!: PrismaService

    constructor(@InjectQueue('domains') private readonly domainsQueue: Queue) {}

    async addToDomainQue(domain: string) {
        this.domainsQueue.add('fetch_data', {
            domain,
        })
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
}
