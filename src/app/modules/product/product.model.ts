import { model, Schema } from 'mongoose';
import { IProduct } from './product.interface';

const productSchema = new Schema<IProduct>(
  {
    category: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    rating: {
      type: String,
      required: false,
    },
    size: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = model<IProduct>('Product', productSchema);
