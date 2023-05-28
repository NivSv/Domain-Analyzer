import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import helmet from 'helmet'
import { Logger } from '@nestjs/common'
import { ConfigService } from './config/config.service'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    const options = {
        origin: ['*'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        optionsSuccessStatus: 204,
    }
    app.enableCors(options)
    app.use(helmet())

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Domains Analyzer API')
        .setDescription('Simple domains analyzer API')
        .setVersion('1.0')
        .build()
    const document = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('api', app, document)

    const configService = new ConfigService()
    await app.listen(configService.port)
    Logger.log(`Application is running on: ${await app.getUrl()}`)
    Logger.log(`Swagger is running on: ${await app.getUrl()}/api`)
}
bootstrap()
