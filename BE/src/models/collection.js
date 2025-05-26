import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const collectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  imgSrc: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }
  ]
}, {
  timestamps: true,
  versionKey: false,
});

collectionSchema.plugin(paginate);

const Collection = mongoose.model('Collection', collectionSchema);
export default Collection