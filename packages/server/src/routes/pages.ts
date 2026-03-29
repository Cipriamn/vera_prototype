import { Router, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../index.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";
import { generateSlug } from "../utils/slug.js";

const router = Router();

const createPageSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1).max(100).optional(),
  isHomepage: z.boolean().optional(),
});

const updatePageSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).optional(),
  elements: z.array(z.any()).optional(),
  isHomepage: z.boolean().optional(),
  order: z.number().optional(),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
});

// Get all pages for a site
router.get(
  "/:siteId/pages",
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Check site ownership
      const site = await prisma.site.findFirst({
        where: {
          id: req.params.siteId,
          userId: req.user!.userId,
        },
      });

      if (!site) {
        throw new AppError("Site not found", 404);
      }

      const pages = await prisma.page.findMany({
        where: { siteId: req.params.siteId },
        orderBy: { order: "asc" },
      });

      res.json({
        success: true,
        data: pages,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Get single page
router.get(
  "/:siteId/pages/:pageId",
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Check site ownership
      const site = await prisma.site.findFirst({
        where: {
          id: req.params.siteId,
          userId: req.user!.userId,
        },
      });

      if (!site) {
        throw new AppError("Site not found", 404);
      }

      const page = await prisma.page.findFirst({
        where: {
          id: req.params.pageId,
          siteId: req.params.siteId,
        },
      });

      if (!page) {
        throw new AppError("Page not found", 404);
      }

      res.json({
        success: true,
        data: page,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Create page
router.post(
  "/:siteId/pages",
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        slug: customSlug,
        isHomepage,
      } = createPageSchema.parse(req.body);

      // Check site ownership
      const site = await prisma.site.findFirst({
        where: {
          id: req.params.siteId,
          userId: req.user!.userId,
        },
      });

      if (!site) {
        throw new AppError("Site not found", 404);
      }

      const slug = customSlug || generateSlug(name);

      // Check if slug already exists for this site
      const existingPage = await prisma.page.findFirst({
        where: {
          siteId: req.params.siteId,
          slug,
        },
      });

      if (existingPage) {
        throw new AppError("A page with this slug already exists", 409);
      }

      // Get max order
      const maxOrderPage = await prisma.page.findFirst({
        where: { siteId: req.params.siteId },
        orderBy: { order: "desc" },
      });

      const order = (maxOrderPage?.order ?? -1) + 1;

      // If setting as homepage, unset other homepages
      if (isHomepage) {
        await prisma.page.updateMany({
          where: { siteId: req.params.siteId },
          data: { isHomepage: false },
        });
      }

      const page = await prisma.page.create({
        data: {
          name,
          slug,
          siteId: req.params.siteId,
          isHomepage: isHomepage || false,
          order,
          elements: [],
        },
      });

      res.status(201).json({
        success: true,
        data: page,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Update page
router.put(
  "/:siteId/pages/:pageId",
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        slug: slugInput,
        elements,
        isHomepage,
        order,
        metaTitle,
        metaDescription,
      } = updatePageSchema.parse(req.body);

      // Check site ownership
      const site = await prisma.site.findFirst({
        where: {
          id: req.params.siteId,
          userId: req.user!.userId,
        },
      });

      if (!site) {
        throw new AppError("Site not found", 404);
      }

      // Check page exists
      const existingPage = await prisma.page.findFirst({
        where: {
          id: req.params.pageId,
          siteId: req.params.siteId,
        },
      });

      if (!existingPage) {
        throw new AppError("Page not found", 404);
      }

      const normalizedSlug =
        slugInput !== undefined ? generateSlug(slugInput) : undefined;
      if (slugInput !== undefined && !normalizedSlug) {
        throw new AppError("Invalid URL slug", 400);
      }

      // Check slug uniqueness if changing
      if (
        normalizedSlug !== undefined &&
        normalizedSlug !== existingPage.slug
      ) {
        const slugExists = await prisma.page.findFirst({
          where: {
            siteId: req.params.siteId,
            slug: normalizedSlug,
            NOT: { id: req.params.pageId },
          },
        });
        if (slugExists) {
          throw new AppError("A page with this slug already exists", 409);
        }
      }

      // Removing homepage: promote another page first
      if (isHomepage === false && existingPage.isHomepage) {
        const anotherPage = await prisma.page.findFirst({
          where: {
            siteId: req.params.siteId,
            NOT: { id: req.params.pageId },
          },
          orderBy: { order: "asc" },
        });
        if (!anotherPage) {
          throw new AppError("A site must have a homepage", 400);
        }
        await prisma.page.update({
          where: { id: anotherPage.id },
          data: { isHomepage: true },
        });
      }

      // If setting as homepage, unset other homepages
      if (isHomepage === true && !existingPage.isHomepage) {
        await prisma.page.updateMany({
          where: {
            siteId: req.params.siteId,
            NOT: { id: req.params.pageId },
          },
          data: { isHomepage: false },
        });
      }

      const page = await prisma.page.update({
        where: { id: req.params.pageId },
        data: {
          ...(name && { name }),
          ...(normalizedSlug !== undefined && { slug: normalizedSlug }),
          ...(elements !== undefined && { elements }),
          ...(isHomepage !== undefined && { isHomepage }),
          ...(order !== undefined && { order }),
          ...(metaTitle !== undefined && {
            metaTitle: metaTitle.trim() ? metaTitle.trim() : null,
          }),
          ...(metaDescription !== undefined && {
            metaDescription: metaDescription.trim()
              ? metaDescription.trim()
              : null,
          }),
        },
      });

      res.json({
        success: true,
        data: page,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Delete page
router.delete(
  "/:siteId/pages/:pageId",
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Check site ownership
      const site = await prisma.site.findFirst({
        where: {
          id: req.params.siteId,
          userId: req.user!.userId,
        },
      });

      if (!site) {
        throw new AppError("Site not found", 404);
      }

      // Check page exists
      const page = await prisma.page.findFirst({
        where: {
          id: req.params.pageId,
          siteId: req.params.siteId,
        },
      });

      if (!page) {
        throw new AppError("Page not found", 404);
      }

      // Don't allow deleting the last page
      const pageCount = await prisma.page.count({
        where: { siteId: req.params.siteId },
      });

      if (pageCount <= 1) {
        throw new AppError("Cannot delete the last page", 400);
      }

      // If deleting homepage, make another page the homepage
      if (page.isHomepage) {
        const anotherPage = await prisma.page.findFirst({
          where: {
            siteId: req.params.siteId,
            NOT: { id: req.params.pageId },
          },
          orderBy: { order: "asc" },
        });

        if (anotherPage) {
          await prisma.page.update({
            where: { id: anotherPage.id },
            data: { isHomepage: true },
          });
        }
      }

      await prisma.page.delete({
        where: { id: req.params.pageId },
      });

      res.json({
        success: true,
        message: "Page deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
