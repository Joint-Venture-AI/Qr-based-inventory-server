import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Category } from '../category/category.model';
import { IProduct } from './product.interface';
import { Product } from './product.model';
import unlinkFile from '../../../shared/unlinkFile';

const createProduct = async (product: IProduct): Promise<IProduct> => {
  const isExistCategory = await Category.findById(product.category);
  if (!isExistCategory) {
    unlinkFile(product.image);
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Category not found');
  }

  const newProduct = await Product.create(product);
  return newProduct;
};

const updateProduct = async (id: string, data: IProduct) => {
  const isExistProduct = await Product.findById(id);
  if (!isExistProduct) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
  }
  if (data.image && isExistProduct.image) {
    unlinkFile(isExistProduct.image);
  }

  const result = await Product.findByIdAndUpdate(id, data, {
    new: true,
  });

  return result;
};

const getAllProducts = async (query: Record<string, unknown>) => {
  const { searchTerm, name, page = '1', limit = '10', ...filters } = query;

  const conditions: any[] = [{ status: 'active' }];

  // Search by category name
  if (searchTerm) {
    const categoryIds = await Category.find({
      name: { $regex: searchTerm, $options: 'i' },
    }).distinct('_id');

    if (categoryIds.length) {
      conditions.push({ category: { $in: categoryIds } });
    }
  }

  // Search by product name
  if (name) {
    conditions.push({ name: { $regex: name, $options: 'i' } });
  }

  // Additional filters
  if (Object.keys(filters).length) {
    conditions.push({
      $and: Object.entries(filters).map(([key, value]) => ({ [key]: value })),
    });
  }

  const where = conditions.length ? { $and: conditions } : {};

  // Pagination
  const pageNumber = parseInt(page as string, 10);
  const pageSize = parseInt(limit as string, 10);
  const skip = (pageNumber - 1) * pageSize;

  // Fetch products with category populated
  const [products, total] = await Promise.all([
    Product.find(where)
      .populate({ path: 'category', select: 'name' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),
    Product.countDocuments(where),
  ]);

  return {
    result: products,
    meta: {
      page: pageNumber,
      total,
    },
  };
};

const productDetails = async (id: string): Promise<IProduct | null> => {
  const product = await Product.findById(id)
    .populate({ path: 'category', select: 'name image -_id' })
    .lean();
  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
  }
  return product;
};

const deleteProduct = async (id: string): Promise<IProduct | null> => {
  const product = await Product.findByIdAndUpdate(
    id,
    { status: 'deleted' },
    { new: true }
  );

  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  // Safely unlink the image if it exists
  if (product.image) {
    try {
      await unlinkFile(product.image);
    } catch (err) {
      console.warn(`Failed to delete image: ${product.image}`, err);
    }
  }

  return product;
};

export const ProductService = {
  createProduct,
  updateProduct,
  getAllProducts,
  productDetails,
  deleteProduct,
};
