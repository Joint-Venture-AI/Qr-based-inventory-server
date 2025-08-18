import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ICategory } from './category.interface';
import { Category } from './category.model';
import unlinkFile from '../../../shared/unlinkFile';

const createCategory = async (categoryData: ICategory) => {
  const isExist: any = await Category.findOne({ name: categoryData.name });
  if (isExist) {
    await unlinkFile(isExist.image);
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Category already exists');
  }

  const result = await Category.create(categoryData);
  return result;
};

const updateCategory = async (id: string, categoryData: ICategory) => {
  const existingCategory = await Category.findById(id);
  if (!existingCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Category not found');
  }

  if (existingCategory.image && categoryData.image) {
    await unlinkFile(existingCategory.image);
  }

  const result = await Category.findByIdAndUpdate(id, categoryData, {
    new: true,
  });
  return result;
};

export const CategoryService = {
  createCategory,
  updateCategory,
};
