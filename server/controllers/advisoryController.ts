import { Request, Response, NextFunction } from 'express';
import { AdvisoryService } from '../services/advisoryService.js';
import { PaginationQuery } from '../../shared/schemas/advisory.js';

export class AdvisoryController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const advisory = await AdvisoryService.createAdvisory(req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Agricultural advisory generated and recorded successfully.',
        data: advisory,
      });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const query = req.query as unknown as PaginationQuery;
      const result = await AdvisoryService.getAdvisoriesByUser(req.user.id, query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const id = req.params.id as string;
      const advisory = await AdvisoryService.getAdvisoryById(id, req.user.id);

      if (!advisory) {
        res.status(404).json({
          success: false,
          error: 'Advisory not found or you do not have permission to view it.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: advisory,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const id = req.params.id as string;
      const deleted = await AdvisoryService.deleteAdvisory(id, req.user.id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Advisory not found or unauthorized to delete.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Advisory deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  static async feedback(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const id = req.params.id as string; // this is advisory_result_id or advisory_id
      const feedbackRecord = await AdvisoryService.submitFeedback(id, req.user.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Feedback recorded successfully. Thank you for helping improve the advisory engine.',
        data: feedbackRecord,
      });
    } catch (error) {
      next(error);
    }
  }

  static async stats(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const stats = await AdvisoryService.getDashboardStats(req.user.id);
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}
