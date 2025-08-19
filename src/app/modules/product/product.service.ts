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
  const { searchTerm, name, page, limit, ...filterData } = query;
  const anyConditions: any[] = [];

  // Add searchTerm condition if present
  if (searchTerm) {
    const categoriesIds = await Category.find({
      name: { $regex: searchTerm, $options: 'i' },
    }).distinct('_id');

    if (categoriesIds.length > 0) {
      anyConditions.push({ category: { $in: categoriesIds } });
    }
  }

  if (name) {
    anyConditions.push({ name: { $regex: name, $options: 'i' } });
  }

  // Filter by additional filterData fields
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    anyConditions.push({ $and: filterConditions });
  }

  // Combine all conditions
  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  // Fetch Category data
  const result = await Product.find(whereConditions)
    .populate({
      path: 'category',
      select: 'name',
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await Product.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};
export const ProductService = {
  createProduct,
  updateProduct,
  getAllProducts,
};
