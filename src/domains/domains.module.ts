import { Module } from '@nestjs/common'
import { DomainsController } from './domains.controller'
import { DomainsService } from './domains.service'
import { PrismaService } from '../prisma.service'
import { BullModule } from '@nestjs/bull'
import { DomainsProcessor } from './domains.processor'

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'domains',
        }),
    ],
    controllers: [DomainsController],
    providers: [DomainsService, PrismaService, DomainsProcessor],
})
export class DomainsModule {}
