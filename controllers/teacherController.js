const User = require('../models/User');
const Teacher = require('../models/Teacher');

// @desc    Create new teacher
// @route   POST /api/teachers
// @access  Private (Admin only)
exports.createTeacher = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      dateOfBirth,
      employeeId,
      subject,
      qualification,
      experience,
      salary,
      classTeacher
    } = req.body;

    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Check if employeeId already exists
    const employeeIdExists = await Teacher.findOne({ employeeId });
    if (employeeIdExists) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID already exists'
      });
    }

    // Profile image
    let profileImage = 'https://via.placeholder.com/150';
    if (req.file) {
      profileImage = req.file.path;
    }

    // User account create
    const user = await User.create({
      name,
      email,
      password,
      role: 'teacher',
      phone,
      address,
      dateOfBirth,
      profileImage
    });

    // Teacher record create
    const teacher = await Teacher.create({
      userId: user._id,
      employeeId,
      subject: Array.isArray(subject) ? subject : [subject],
      qualification,
      experience: experience || 0,
      salary,
      classTeacher
    });

    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      data: {
        user,
        teacher
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private
exports.getAllTeachers = async (req, res) => {
  try {
    const { subject, search } = req.query;

    let query = {};

    if (subject) {
      query.subject = { $in: [subject] };
    }

    const teachers = await Teacher.find(query)
      .populate('userId', 'name email phone address profileImage dateOfBirth isActive')
      .sort({ createdAt: -1 });

    let filteredTeachers = teachers;
    if (search) {
      filteredTeachers = teachers.filter(teacher =>
        teacher.userId.name.toLowerCase().includes(search.toLowerCase()) ||
        teacher.employeeId.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.status(200).json({
      success: true,
      count: filteredTeachers.length,
      data: filteredTeachers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single teacher
// @route   GET /api/teachers/:id
// @access  Private
exports.getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('userId', 'name email phone address profileImage dateOfBirth isActive');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update teacher
// @route   PUT /api/teachers/:id
// @access  Private (Admin only)
exports.updateTeacher = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      dateOfBirth,
      subject,
      qualification,
      experience,
      salary,
      classTeacher
    } = req.body;

    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    const userUpdateData = {
      name,
      phone,
      address,
      dateOfBirth
    };

    if (req.file) {
      userUpdateData.profileImage = req.file.path;
    }

    await User.findByIdAndUpdate(teacher.userId, userUpdateData);

    const teacherUpdateData = {
      subject: Array.isArray(subject) ? subject : [subject],
      qualification,
      experience,
      salary,
      classTeacher
    };

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      teacherUpdateData,
      { new: true, runValidators: true }
    ).populate('userId');

    res.status(200).json({
      success: true,
      message: 'Teacher updated successfully',
      data: updatedTeacher
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete teacher
// @route   DELETE /api/teachers/:id
// @access  Private (Admin only)
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    await User.findByIdAndDelete(teacher.userId);
    await Teacher.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Teacher deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get teachers by subject
// @route   GET /api/teachers/subject/:subjectName
// @access  Private
exports.getTeachersBySubject = async (req, res) => {
  try {
    const { subjectName } = req.params;

    const teachers = await Teacher.find({
      subject: { $in: [subjectName] }
    }).populate('userId', 'name email phone profileImage');

    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Toggle teacher status
// @route   PUT /api/teachers/:id/status
// @access  Private (Admin only)
exports.toggleTeacherStatus = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    const user = await User.findById(teacher.userId);
    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Teacher ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get current teacher profile
// @route   GET /api/teachers/profile/me
// @access  Private (Teacher)
exports.getTeacherProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user._id })
      .populate('userId', 'name email phone profileImage')
      .populate('classTeacher.class');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    console.error('Get Teacher Profile Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch teacher profile'
    });
  }
};
