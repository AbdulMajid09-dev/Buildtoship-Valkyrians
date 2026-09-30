import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const formattedErrors = formatZodErrors(result.error);
      res.status(400).json({
        success: false,
        error: 'Validation failed. Please check the supplied information.',
        errors: formattedErrors,
      });
      return;
    }
    req.body = result.data;
    next();
  };
}

export function validateParams(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      const formattedErrors = formatZodErrors(result.error);
      res.status(400).json({
        success: false,
        error: 'Invalid parameter in URL path.',
        errors: formattedErrors,
      });
      return;
    }
    req.params = result.data;
    next();
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const formattedErrors = formatZodErrors(result.error);
      res.status(400).json({
        success: false,
        error: 'Invalid query parameters.',
        errors: formattedErrors,
      });
      return;
    }
    req.query = result.data as any;
    next();
  };
}

function formatZodErrors(error: ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.') || 'root';
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  }
  return errors;
}
