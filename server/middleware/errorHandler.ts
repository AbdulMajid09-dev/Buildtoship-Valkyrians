import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('[Error Handler Caught Exception]:', err?.message || err);

  // Status code resolution
  const statusCode = err.status || err.statusCode || 500;

  // Safe message
  const isProduction = process.env.NODE_ENV === 'production';
  const message =
    statusCode === 500 && isProduction
      ? 'An unexpected error occurred while processing your request. Please try again later.'
      : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(err.code ? { code: err.code } : {}),
  });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: 'The requested API route was not found.',
  });
}
