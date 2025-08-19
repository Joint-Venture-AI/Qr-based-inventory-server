import z from 'zod';

export const objectIdSchema = z
  .string()
  .nonempty('Category is required')
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

// Optional: price as a numeric string (e.g., "19.99")
const priceStringSchema = z
  .string()
  .nonempty('price is required')
  .refine(v => /^\d+(\.\d+)?$/.test(v), 'price must be a numeric string');

// Base product schema (create)
const createProductZodSchema = z.object({
  body: z.object({
    name: z.string().nonempty('name is required').min(1, 'name is required'),
    price: priceStringSchema,
    category: objectIdSchema,
    rating: z.string().optional(),
    size: z.string().optional(),
  }),
});

// Partial for updates (all fields optional)
const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    price: priceStringSchema.optional(),
    category: objectIdSchema.optional(),
    rating: z.string().optional(),
    size: z.string().optional(),
  }),
});

export const ProductValidation = {
  createProductZodSchema,
  updateProductSchema,
};
