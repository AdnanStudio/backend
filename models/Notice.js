const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['general', 'urgent', 'holiday', 'exam', 'event', 'admission'],
    default: 'general'
  },
  attachments: [{
    fileUrl: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      enum: ['pdf', 'image'],
      required: true
    },
    fileName: {
      type: String
    },
    publicId: {
      type: String // Cloudinary public ID for deletion
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
noticeSchema.index({ publishDate: -1 });
noticeSchema.index({ isActive: 1 });

module.exports = mongoose.model('Notice', noticeSchema);