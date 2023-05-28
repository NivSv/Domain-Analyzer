import {
    BadRequestException,
    Controller,
    Get,
    Inject,
    NotFoundException,
    Param,
    Post,
    Req,
} from '@nestjs/common'
import { DomainsService } from './domains.service'
import { isValidDomain } from '../utils/zod.utils'
import {
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger'
import { Domains } from '@prisma/client'
import { domainStub } from './stubs/domain.stub'
import { Request } from 'express'

@ApiTags('domains')
@Controller('domains')
export class DomainsController {
    @Inject(DomainsService) private readonly domainsService!: DomainsService

    @ApiOkResponse({
        description: 'Data of the domain.',
        schema: {
            example: domainStub,
        },
    })
    @ApiBadRequestResponse({
        description: 'Invalid domain.',
    })
    @ApiNotFoundResponse({
        description:
            'Domain Analysis not found. (Adding to queue for feature analysis)',
    })
    @Get(':domain')
    async getDomainData(
        @Req() req: Request,
        @Param('domain') domain: string
    ): Promise<Domains> {
        if (isValidDomain(domain) == false)
            throw new BadRequestException('Invalid domain.')
        const domainFound = await this.domainsService.getDomainData(domain)
        if (domainFound == null) {
            throw new NotFoundException(
                'Domain Analysis not found. Please check back later.'
            )
        }
        return domainFound
    }

    @ApiOkResponse({
        description: 'Added domain to queue for feature analysis',
    })
    @ApiBadRequestResponse({
        description: 'Invalid domain.',
    })
    @Post(':domain')
    async addToDomainQue(@Param('domain') domain: string): Promise<void> {
        if (isValidDomain(domain) == false)
            throw new BadRequestException('Invalid domain.')
        return await this.domainsService.addToDomainQue(domain)
    }
}
