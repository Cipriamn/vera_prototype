import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../index.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// Get published site by slug
router.get('/sites/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const site = await prisma.site.findFirst({
      where: {
        slug: req.params.slug,
        isPublished: true,
      },
      include: {
        pages: {
          select: {
            id: true,
            name: true,
            slug: true,
            isHomepage: true,
            order: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!site) {
      throw new AppError('Site not found or not published', 404);
    }

    // Get homepage
    const homepage = site.pages.find((p: { isHomepage: boolean }) => p.isHomepage) || site.pages[0];

    if (!homepage) {
      throw new AppError('No pages found', 404);
    }

    const page = await prisma.page.findUnique({
      where: { id: homepage.id },
    });

    res.json({
      success: true,
      data: {
        site: {
          id: site.id,
          name: site.name,
          slug: site.slug,
          settings: site.settings,
          pages: site.pages,
        },
        page,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get published page by site slug and page slug
router.get('/sites/:siteSlug/:pageSlug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const site = await prisma.site.findFirst({
      where: {
        slug: req.params.siteSlug,
        isPublished: true,
      },
      include: {
        pages: {
          select: {
            id: true,
            name: true,
            slug: true,
            isHomepage: true,
            order: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!site) {
      throw new AppError('Site not found or not published', 404);
    }

    const page = await prisma.page.findFirst({
      where: {
        siteId: site.id,
        slug: req.params.pageSlug,
      },
    });

    if (!page) {
      throw new AppError('Page not found', 404);
    }

    res.json({
      success: true,
      data: {
        site: {
          id: site.id,
          name: site.name,
          slug: site.slug,
          settings: site.settings,
          pages: site.pages,
        },
        page,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
