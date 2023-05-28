import { Controller, Get, Inject, Param, Post } from '@nestjs/common'
import { DomainsService } from './domains.service'

@Controller('domains')
export class DomainsController {
    @Inject(DomainsService) private readonly domainsService!: DomainsService

    @Get(':domain')
    async getDomainData(@Param('domain') domain: string) {
        return await this.domainsService.getDomainData(domain)
    }

    @Post(':domain')
    async addToDomainQue(@Param('domain') domain: string) {
        return await this.domainsService.addToDomainQue(domain)
    }
}
