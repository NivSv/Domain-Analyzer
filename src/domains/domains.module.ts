import { Module } from '@nestjs/common'
import { DomainsController } from './domains.controller'
import { DomainsService } from './domains.service'
import { PrismaService } from '../prisma.service'
import { BullModule } from '@nestjs/bull'

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'domains',
        }),
    ],
    controllers: [DomainsController],
    providers: [DomainsService, PrismaService],
})
export class DomainsModule {}
