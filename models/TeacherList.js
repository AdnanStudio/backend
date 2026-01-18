const mongoose = require('mongoose');

const teacherListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Teacher name is required'],
    trim: true
  },
  image: {
    url: String,
    publicId: String
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  qualification: {
    type: String,
    trim: true
  },
  subjects: [{
    type: String
  }],
  experience: {
    type: String,
    trim: true
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

module.exports = mongoose.model('TeacherList', teacherListSchema);