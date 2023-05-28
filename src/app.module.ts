import { Module } from '@nestjs/common'
import { DomainsModule } from './domains/domains.module'

@Module({
    imports: [DomainsModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
