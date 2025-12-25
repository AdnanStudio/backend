const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage for all files including PDFs
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine resource type based on file mimetype
    let resourceType = 'image';
    let format = undefined;
    
    if (file.mimetype === 'application/pdf') {
      resourceType = 'raw';
      format = 'pdf';
    } else if (file.mimetype.startsWith('image/')) {
      resourceType = 'image';
      format = file.mimetype.split('/')[1];
    }

    return {
      folder: 'school-management/settings',
      resource_type: resourceType,
      format: format,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'],
      transformation: resourceType === 'image' ? [
        { width: 1920, height: 1080, crop: 'limit' }
      ] : undefined
    };
  }
});

// ✅ Storage for user profile pictures
const userProfileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'school-management/users',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 500, height: 500, crop: 'fill', gravity: 'face' }
    ]
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image files and PDFs are allowed!'), false);
    }
  }
});

// ✅ Upload for user profile pictures
const uploadUserProfile = multer({
  storage: userProfileStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for profile pics
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

module.exports = { cloudinary, upload, uploadUserProfile };