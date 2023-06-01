import { Module } from '@nestjs/common'
import { DomainsController } from './domains.controller'
import { DomainsService } from './domains.service'
import { PrismaService } from '../prisma.service'
import { BullModule } from '@nestjs/bull'
import { DomainsProcessor } from './domains.processor'
import { ConfigService } from '../config/config.service'
import { ApisService } from '../apis/apis.service'

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'domains',
        }),
    ],
    controllers: [DomainsController],
    providers: [
        DomainsService,
        PrismaService,
        DomainsProcessor,
        ApisService,
        ConfigService,
    ],
})
export class DomainsModule {}
