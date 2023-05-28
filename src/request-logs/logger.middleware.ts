import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { PrismaService } from '../prisma.service'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        const prisma = new PrismaService()
        await prisma.requestLogs.create({
            data: {
                endpoint: req.method + req.baseUrl,
                ip: req.ip,
                parameters: JSON.stringify(req.params),
            },
        })
        next()
    }
}
