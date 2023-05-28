import {
    ConflictException,
    Controller,
    Get,
    Inject,
    NotFoundException,
    Param,
    Post,
} from '@nestjs/common'
import { DomainsService } from './domains.service'
import { z } from 'zod'
import { isValidDomain } from '../utils/zod.utils'

@Controller('domains')
export class DomainsController {
    @Inject(DomainsService) private readonly domainsService!: DomainsService

    @Get(':domain')
    async getDomainData(@Param('domain') domain: string) {
        if (isValidDomain(domain) == false)
            throw new ConflictException('Invalid domain.')
        const domainFound = await this.domainsService.getDomainData(domain)
        if (domainFound == null) {
            throw new NotFoundException(
                'Domain Analysis not found. Please check back later.'
            )
        }
        return domainFound
    }

    @Post(':domain')
    async addToDomainQue(@Param('domain') domain: string) {
        if (isValidDomain(domain) == false)
            throw new ConflictException('Invalid domain.')
        return await this.domainsService.addToDomainQue(domain)
    }
}
