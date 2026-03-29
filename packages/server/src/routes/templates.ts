import { Router, Request, Response, NextFunction } from 'express';
import { templates, getTemplateById } from '../data/templates.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// Get all templates
router.get('/', (_req: Request, res: Response) => {
  const templatesList = templates.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    thumbnail: t.thumbnail,
    category: t.category,
  }));

  res.json({
    success: true,
    data: templatesList,
  });
});

// Get single template
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const template = getTemplateById(req.params.id);

    if (!template) {
      throw new AppError('Template not found', 404);
    }

    res.json({
      success: true,
      data: template,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
