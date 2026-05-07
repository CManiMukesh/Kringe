import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 180,
    trim: true
  },
  anonymousLabel: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  ipHash: {
    type: String,
    required: true,
    index: true
  }
});

postSchema.index({ createdAt: -1 });

export default mongoose.model('Post', postSchema);