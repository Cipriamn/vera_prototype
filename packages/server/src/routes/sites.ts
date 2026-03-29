import { NextFunction, Response, Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { getTemplateById } from "../data/templates.js";
import { prisma } from "../index.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";
import { generateUniqueSlug } from "../utils/slug.js";

const router = Router();

const createSiteSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  templateId: z.string().optional(),
});

const updateSiteSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).optional(),
  settings: z
    .object({
      primaryColor: z.string().optional(),
      secondaryColor: z.string().optional(),
      fontFamily: z.string().optional(),
      favicon: z.string().optional(),
      socialImage: z.string().optional(),
      customCss: z.string().optional(),
    })
    .optional(),
});

// Get all sites for user
router.get(
  "/",
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const sites = await prisma.site.findMany({
        where: { userId: req.user!.userId },
        include: {
          pages: {
            select: {
              id: true,
              name: true,
              slug: true,
              isHomepage: true,
              order: true,
            },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      res.json({
        success: true,
        data: sites,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Get single site
router.get(
  "/:id",
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const site = await prisma.site.findFirst({
        where: {
          id: req.params.id,
          userId: req.user!.userId,
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
            orderBy: { order: "asc" },
          },
        },
      });

      if (!site) {
        throw new AppError("Site not found", 404);
      }

      res.json({
        success: true,
        data: site,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Create site
router.post(
  "/",
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { name, templateId } = createSiteSchema.parse(req.body);

      const nameTaken = await prisma.site.findFirst({
        where: {
          userId: req.user!.userId,
          name: { equals: name, mode: "insensitive" },
        },
      });
      if (nameTaken) {
        throw new AppError("A site with this name already exists", 409);
      }

      const slug = generateUniqueSlug(name);

      // Check if using template
      const template = templateId ? getTemplateById(templateId) : null;

      if (templateId && !template) {
        throw new AppError("Template not found", 404);
      }

      // Prepare pages data - cast to JSON for Prisma
      const pagesData = template
        ? template.pages.map((page) => ({
            name: page.name,
            slug: page.slug,
            isHomepage: page.isHomepage,
            order: page.order,
            elements: JSON.parse(
              JSON.stringify(
                page.elements.map((el) => ({
                  ...el,
                  id: uuidv4(),
                })),
              ),
            ),
          }))
        : [
            {
              name: "Home",
              slug: "home",
              isHomepage: true,
              order: 0,
              elements: [],
            },
          ];

      // Create site with pages
      const site = await prisma.site.create({
        data: {
          name,
          slug,
          userId: req.user!.userId,
          templateId,
          settings: JSON.parse(
            JSON.stringify(
              template?.settings || {
                primaryColor: "#3b82f6",
                secondaryColor: "#1f2937",
                fontFamily: "Inter",
              },
            ),
          ),
          pages: {
            create: pagesData,
          },
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
            orderBy: { order: "asc" },
          },
        },
      });

      res.status(201).json({
        success: true,
        data: site,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Update site
router.put(
  "/:id",
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { name, slug, settings } = updateSiteSchema.parse(req.body);

      // Check ownership
      const existingSite = await prisma.site.findFirst({
        where: {
          id: req.params.id,
          userId: req.user!.userId,
        },
      });

      if (!existingSite) {
        throw new AppError("Site not found", 404);
      }

      if (name) {
        const nameConflict = await prisma.site.findFirst({
          where: {
            userId: req.user!.userId,
            id: { not: req.params.id },
            name: { equals: name, mode: "insensitive" },
          },
        });
        if (nameConflict) {
          throw new AppError("A site with this name already exists", 409);
        }
      }

      // Check slug uniqueness if changing
      if (slug && slug !== existingSite.slug) {
        const slugExists = await prisma.site.findUnique({
          where: { slug },
        });
        if (slugExists) {
          throw new AppError("Slug already in use", 409);
        }
      }

      const site = await prisma.site.update({
        where: { id: req.params.id },
        data: {
          ...(name && { name }),
          ...(slug && { slug }),
          ...(settings && {
            settings: {
              ...(existingSite.settings as object),
              ...settings,
            },
          }),
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
          },
        },
      });

      res.json({
        success: true,
        data: site,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Delete site
router.delete(
  "/:id",
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Check ownership
      const site = await prisma.site.findFirst({
        where: {
          id: req.params.id,
          userId: req.user!.userId,
        },
      });

      if (!site) {
        throw new AppError("Site not found", 404);
      }

      await prisma.site.delete({
        where: { id: req.params.id },
      });

      res.json({
        success: true,
        message: "Site deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

// Publish site
router.post(
  "/:id/publish",
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const site = await prisma.site.findFirst({
        where: {
          id: req.params.id,
          userId: req.user!.userId,
        },
      });

      if (!site) {
        throw new AppError("Site not found", 404);
      }

      const updatedSite = await prisma.site.update({
        where: { id: req.params.id },
        data: { isPublished: true },
        include: {
          pages: {
            select: {
              id: true,
              name: true,
              slug: true,
              isHomepage: true,
              order: true,
            },
          },
        },
      });

      res.json({
        success: true,
        data: updatedSite,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Unpublish site
router.post(
  "/:id/unpublish",
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const site = await prisma.site.findFirst({
        where: {
          id: req.params.id,
          userId: req.user!.userId,
        },
      });

      if (!site) {
        throw new AppError("Site not found", 404);
      }

      const updatedSite = await prisma.site.update({
        where: { id: req.params.id },
        data: { isPublished: false },
        include: {
          pages: {
            select: {
              id: true,
              name: true,
              slug: true,
              isHomepage: true,
              order: true,
            },
          },
        },
      });

      res.json({
        success: true,
        data: updatedSite,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
