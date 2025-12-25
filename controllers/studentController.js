const User = require('../models/User');
const Student = require('../models/Student');

// @desc    Create new student
// @route   POST /api/students
// @access  Private (Admin/Teacher)
exports.createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      dateOfBirth,
      studentId,
      class: studentClass,
      section,
      rollNumber,
      guardianName,
      guardianPhone,
      guardianEmail,
      bloodGroup,
      previousSchool
    } = req.body;

    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Check if studentId already exists
    const studentIdExists = await Student.findOne({ studentId });
    if (studentIdExists) {
      return res.status(400).json({
        success: false,
        message: 'Student ID already exists'
      });
    }

    // Profile image (যদি upload করা হয়)
    let profileImage = 'https://via.placeholder.com/150';
    if (req.file) {
      profileImage = req.file.path;
    }

    // User account তৈরি করা
    const user = await User.create({
      name,
      email,
      password,
      role: 'student',
      phone,
      address,
      dateOfBirth,
      profileImage
    });

    // Student record তৈরি করা
    const student = await Student.create({
      userId: user._id,
      studentId,
      class: studentClass,
      section,
      rollNumber,
      guardianName,
      guardianPhone,
      guardianEmail,
      bloodGroup,
      previousSchool
    });

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: {
        user,
        student
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

// @desc    Get current student's profile
// @route   GET /api/students/profile
// @access  Private (Student)
exports.getStudentProfile = async (req, res) => {
  try {
    // req.user._id আসে আপনার auth middleware থেকে
    const student = await Student.findOne({ userId: req.user._id })
      .populate('userId', 'name email phone profileImage')
      .populate('class');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Get Student Profile Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch student profile'
    });
  }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Private
exports.getAllStudents = async (req, res) => {
  try {
    const { class: studentClass, section, search } = req.query;

    let query = {};

    // Class filter
    if (studentClass) {
      query.class = studentClass;
    }

    // Section filter
    if (section) {
      query.section = section;
    }

    const students = await Student.find(query)
      .populate('userId', 'name email phone address profileImage dateOfBirth isActive')
      .sort({ rollNumber: 1 });

    // Search filter (name বা studentId দিয়ে)
    let filteredStudents = students;
    if (search) {
      filteredStudents = students.filter(student => 
        student.userId.name.toLowerCase().includes(search.toLowerCase()) ||
        student.studentId.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.status(200).json({
      success: true,
      count: filteredStudents.length,
      data: filteredStudents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('userId', 'name email phone address profileImage dateOfBirth isActive');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (Admin/Teacher)
exports.updateStudent = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      dateOfBirth,
      class: studentClass,
      section,
      rollNumber,
      guardianName,
      guardianPhone,
      guardianEmail,
      bloodGroup,
      previousSchool
    } = req.body;

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // User info update
    const userUpdateData = {
      name,
      phone,
      address,
      dateOfBirth
    };

    if (req.file) {
      userUpdateData.profileImage = req.file.path;
    }

    await User.findByIdAndUpdate(student.userId, userUpdateData);

    // Student info update
    const studentUpdateData = {
      class: studentClass,
      section,
      rollNumber,
      guardianName,
      guardianPhone,
      guardianEmail,
      bloodGroup,
      previousSchool
    };

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      studentUpdateData,
      { new: true, runValidators: true }
    ).populate('userId');

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Admin only)
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // User account এবং student record উভয়ই delete করা
    await User.findByIdAndDelete(student.userId);
    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get students by class
// @route   GET /api/students/class/:className/:section
// @access  Private
exports.getStudentsByClass = async (req, res) => {
  try {
    const { className, section } = req.params;

    const students = await Student.find({
      class: className,
      section: section
    })
      .populate('userId', 'name email phone profileImage')
      .sort({ rollNumber: 1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Activate/Deactivate student
// @route   PUT /api/students/:id/status
// @access  Private (Admin only)
exports.toggleStudentStatus = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const user = await User.findById(student.userId);
    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Student ${user.isActive ? 'activated' : 'deactivated'} successfully`,
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