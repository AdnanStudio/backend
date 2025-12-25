const Mark = require('../models/Mark');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Notification = require('../models/Notification');

// Calculate grade based on marks
const calculateGrade = (obtainedMarks, totalMarks) => {
  const percentage = (obtainedMarks / totalMarks) * 100;
  
  if (percentage >= 80) return 'A+';
  if (percentage >= 70) return 'A';
  if (percentage >= 60) return 'A-';
  if (percentage >= 50) return 'B';
  if (percentage >= 40) return 'C';
  if (percentage >= 33) return 'D';
  return 'F';
};

// @desc    Create mark entry
// @route   POST /api/marks
// @access  Private (Admin/Teacher)
exports.createMark = async (req, res) => {
  try {
    const { 
      student, 
      subject, 
      examType, 
      examName, 
      totalMarks, 
      obtainedMarks,
      examDate,
      remarks,
      isPublished
    } = req.body;

    // Get teacher ID
    let teacherId;
    if (req.user.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: req.user._id });
      teacherId = teacher._id;
    }

    const grade = calculateGrade(obtainedMarks, totalMarks);

    const mark = await Mark.create({
      student,
      subject,
      examType,
      examName,
      totalMarks,
      obtainedMarks,
      grade,
      examDate,
      remarks,
      isPublished: isPublished || false,
      teacher: teacherId
    });

    // If published, notify student
    if (isPublished) {
      const studentData = await Student.findById(student).populate('userId');
      await Notification.create({
        recipient: studentData.userId._id,
        type: 'marks',
        title: 'New Marks Published',
        message: `Your ${examType} marks for ${subject} have been published`,
        link: `/dashboard/marks`,
        relatedId: mark._id
      });
    }

    res.status(201).json({
      success: true,
      message: 'Mark created successfully',
      data: mark
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get all marks
// @route   GET /api/marks
// @access  Private
exports.getAllMarks = async (req, res) => {
  try {
    let query = {};

    // If student, show only their marks
    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user._id });
      query.student = student._id;
      query.isPublished = true;
    }

    const marks = await Mark.find(query)
      .populate({
        path: 'student',
        populate: { path: 'userId', select: 'name email profileImage' }
      })
      .populate({
        path: 'teacher',
        populate: { path: 'userId', select: 'name email' }
      })
      .sort({ examDate: -1 });

    res.status(200).json({
      success: true,
      count: marks.length,
      data: marks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get marks by student
// @route   GET /api/marks/student/:studentId
// @access  Private
exports.getMarksByStudent = async (req, res) => {
  try {
    const marks = await Mark.find({ 
      student: req.params.studentId,
      isPublished: true 
    })
      .populate('teacher', 'userId')
      .populate({
        path: 'teacher',
        populate: { path: 'userId', select: 'name' }
      })
      .sort({ examDate: -1 });

    // Calculate statistics
    const totalMarksSum = marks.reduce((acc, mark) => acc + mark.totalMarks, 0);
    const obtainedMarksSum = marks.reduce((acc, mark) => acc + mark.obtainedMarks, 0);
    const percentage = totalMarksSum > 0 ? ((obtainedMarksSum / totalMarksSum) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      data: {
        marks,
        statistics: {
          totalExams: marks.length,
          totalMarks: totalMarksSum,
          obtainedMarks: obtainedMarksSum,
          percentage: `${percentage}%`
        }
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

// @desc    Update mark
// @route   PUT /api/marks/:id
// @access  Private (Admin/Teacher)
exports.updateMark = async (req, res) => {
  try {
    const { totalMarks, obtainedMarks, remarks, isPublished } = req.body;

    const updateData = { remarks };

    if (totalMarks) updateData.totalMarks = totalMarks;
    if (obtainedMarks) updateData.obtainedMarks = obtainedMarks;

    if (totalMarks && obtainedMarks) {
      updateData.grade = calculateGrade(obtainedMarks, totalMarks);
    }

    if (isPublished !== undefined) updateData.isPublished = isPublished;

    const mark = await Mark.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('student');

    if (!mark) {
      return res.status(404).json({
        success: false,
        message: 'Mark not found'
      });
    }

    // If newly published, notify student
    if (isPublished && !mark.isPublished) {
      const student = await Student.findById(mark.student).populate('userId');
      await Notification.create({
        recipient: student.userId._id,
        type: 'marks',
        title: 'Marks Updated',
        message: `Your marks for ${mark.subject} have been updated`,
        link: `/dashboard/marks`,
        relatedId: mark._id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mark updated successfully',
      data: mark
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete mark
// @route   DELETE /api/marks/:id
// @access  Private (Admin/Teacher)
exports.deleteMark = async (req, res) => {
  try {
    const mark = await Mark.findByIdAndDelete(req.params.id);

    if (!mark) {
      return res.status(404).json({
        success: false,
        message: 'Mark not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mark deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};