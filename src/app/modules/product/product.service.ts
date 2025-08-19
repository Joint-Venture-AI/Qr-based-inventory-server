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

export const ProductService = {
  createProduct,
  updateProduct,
};
