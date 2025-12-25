const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student', 'staff', 'librarian', 'accountant'],
    default: 'student'
  },
  profileImage: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // ✅ Notifications field added
  notifications: [{
    message: String,
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    read: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);


// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6
//   },
//   role: {
//     type: String,
//     enum: ['admin', 'teacher', 'student', 'staff', 'librarian', 'accountant'], // ✅ New roles added
//     default: 'student'
//   },
//   profileImage: {
//     type: String,
//     default: 'https://via.placeholder.com/150'
//   },
//   phone: {
//     type: String,
//     trim: true
//   },
//   address: {
//     type: String,
//     trim: true
//   },
//   dateOfBirth: {
//     type: Date
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   createdBy: { // ✅ Admin je create korlo tar reference
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }
// }, {
//   timestamps: true
// });

// // Password hash করা before saving - ASYNC FUNCTION WITHOUT NEXT
// userSchema.pre('save', async function() {
//   // যদি password modify না হয় তাহলে skip করো
//   if (!this.isModified('password')) {
//     return;
//   }
  
//   // Hash password
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// // Password verify করার method
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// module.exports = mongoose.model('User', userSchema);