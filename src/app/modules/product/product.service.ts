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

export const ProductService = {
  createProduct,
};
