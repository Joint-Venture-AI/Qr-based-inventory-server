import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getFilePathMultiple } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { ProductService } from './product.service';

const createProduct = catchAsync(async (req, res) => {
  const value = { ...req.body };

  const image = getFilePathMultiple(req.files, 'image', 'image');

  if (image?.length) value.image = image[0];

  const result = await ProductService.createProduct(value);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

export const ProductController = {
  createProduct,
};
