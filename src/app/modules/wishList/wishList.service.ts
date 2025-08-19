import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Product } from '../product/product.model';
import { IWishList } from './wishList.interface';
import { WishList } from './wishList.model';

const createWishList = async (data: IWishList): Promise<IWishList> => {
  const [product, existingWish] = await Promise.all([
    Product.findById(data.product),
    WishList.findOne({ user: data.user, product: data.product }),
  ]);

  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  if (existingWish) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Product already in wishlist');
  }

  return WishList.create(data);
};

export const WishListService = {
  createWishList,
};
