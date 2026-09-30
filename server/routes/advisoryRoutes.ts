import { Router } from 'express';
import { AdvisoryController } from '../controllers/advisoryController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody, validateParams, validateQuery } from '../middleware/validation.js';
import {
  AdvisoryRequestSchema,
  FeedbackSchema,
  IDParamSchema,
  PaginationSchema,
} from '../../shared/schemas/advisory.js';

export const advisoryRouter = Router();

// All advisory routes require authentication
advisoryRouter.use(requireAuth);

advisoryRouter.post('/', validateBody(AdvisoryRequestSchema), AdvisoryController.create);
advisoryRouter.get('/', validateQuery(PaginationSchema), AdvisoryController.list);
advisoryRouter.get('/stats', AdvisoryController.stats);
advisoryRouter.get('/:id', validateParams(IDParamSchema), AdvisoryController.getById);
advisoryRouter.delete('/:id', validateParams(IDParamSchema), AdvisoryController.delete);
advisoryRouter.post('/:id/feedback', validateParams(IDParamSchema), validateBody(FeedbackSchema), AdvisoryController.feedback);
