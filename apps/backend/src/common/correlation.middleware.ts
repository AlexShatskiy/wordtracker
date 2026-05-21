import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { correlationStore } from './correlation.store';

const CORRELATION_HEADER = 'x-correlation-id';

@Injectable()
export class CorrelationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const id = (req.headers[CORRELATION_HEADER] as string | undefined) ?? randomUUID();
    res.setHeader(CORRELATION_HEADER, id);
    correlationStore.run(id, next);
  }
}
