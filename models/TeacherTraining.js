const mongoose = require('mongoose');

const teacherTrainingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Teacher name is required'],
    trim: true
  },
  image: {
    url: String,
    publicId: String
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
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

module.exports = mongoose.model('TeacherTraining', teacherTrainingSchema);