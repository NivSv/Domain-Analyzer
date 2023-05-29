import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { DomainsModule } from './domains/domains.module'
import { ThrottlerModule } from '@nestjs/throttler'
import { BullModule } from '@nestjs/bull'
import { ConfigModule } from './config/config.module'
import { ZodValidationPipe } from 'nestjs-zod'
import { APP_PIPE } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { LoggerMiddleware } from './request-logs/logger.middleware'
import { ConfigService } from './config/config.service'

@Module({
    imports: [
        ConfigModule,
        ScheduleModule.forRoot(),
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 10,
        }),
        BullModule.forRootAsync({
            useFactory: () => {
                const configService = new ConfigService()
                return {
                    redis: {
                        host: configService.REDIS_HOST,
                        port: 6379,
                    },
                }
            },
        }),
        DomainsModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_PIPE,
            useClass: ZodValidationPipe,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*')
    }
}
