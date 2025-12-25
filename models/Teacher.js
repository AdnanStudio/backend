const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  subject: {
    type: [String],
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    default: 0
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  salary: {
    type: Number,
    required: true
  },
  classTeacher: {
    class: String,
    section: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Teacher', teacherSchema);