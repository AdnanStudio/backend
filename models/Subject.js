const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true,
    unique: true
  },
  code: {
    type: String,
    required: [true, 'Subject code is required'],
    trim: true,
    unique: true,
    uppercase: true
  },
  description: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    enum: ['Science', 'Arts', 'Commerce', 'General'],
    default: 'General'
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  credits: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  type: {
    type: String,
    enum: ['Theory', 'Practical', 'Both'],
    default: 'Theory'
  },
  passingMarks: {
    type: Number,
    default: 33,
    min: 0,
    max: 100
  },
  totalMarks: {
    type: Number,
    default: 100,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for faster searches
subjectSchema.index({ name: 1, code: 1 });
subjectSchema.index({ department: 1, isActive: 1 });

module.exports = mongoose.model('Subject', subjectSchema);