const mongoose = require('mongoose');

const websiteSettingSchema = new mongoose.Schema({
  schoolName: {
    type: String,
    required: true,
    default: 'IDEAL COLLEGE'
  },
  schoolAddress: {
    type: String,
    default: 'Dhanmondi, Dhaka'
  },
  schoolPhone: {
    type: String,
    default: '+880 1234-567890'
  },
  schoolEmail: {
    type: String,
    default: 'info@idealcollege.edu.bd'
  },
  logo: {
    type: String,
    default: ''
  },
  headerImage: {
    type: String,
    default: ''
  },
  aboutText: {
    type: String,
    default: ''
  },
  aboutImage: {
    type: String,
    default: ''
  },
  visionMission: {
    type: String,
    default: ''
  },
  totalStudents: {
    type: Number,
    default: 0
  },
  totalTeachers: {
    type: Number,
    default: 0
  },
  totalStaff: {
    type: Number,
    default: 0
  },
  facebookLink: {
    type: String,
    default: ''
  },
  youtubeLink: {
    type: String,
    default: ''
  },
  playStoreLink: {
    type: String,
    default: ''
  },
  appStoreLink: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WebsiteSetting', websiteSettingSchema);
