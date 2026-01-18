const mongoose = require('mongoose');

const clubMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Member name is required'],
    trim: true
  },
  image: {
    url: String,
    publicId: String
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ClubMember', clubMemberSchema);