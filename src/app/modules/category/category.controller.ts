import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CategoryService } from './category.service';
import { getFilePathMultiple } from '../../../shared/getFilePath';

const createCategory = catchAsync(async (req, res) => {
  const value = { ...req.body };

  const image = getFilePathMultiple(req.files, 'image', 'image');

  if (image?.length) value.image = image[0];

  const result = await CategoryService.createCategory(value);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const value = { ...req.body };

  const image = getFilePathMultiple(req.files, 'image', 'image');

  if (image?.length) value.image = image[0];

  const result = await CategoryService.updateCategory(req.params.id, value);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Category updated successfully',
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  updateCategory,
};
