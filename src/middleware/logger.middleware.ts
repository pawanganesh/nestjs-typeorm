import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createLogger, format, transports } from 'winston';
const { combine, label, timestamp, prettyPrint } = format;

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  logger = createLogger({
    format: combine(timestamp(), prettyPrint()),
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'logs/access.log' }),
    ],
  });
  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;

      this.logger.log({
        level: 'info',
        message: `${method} ${originalUrl} ${statusCode} - ${userAgent} ${ip}`,
      });
    });

    next();
  }
}
