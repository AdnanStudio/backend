const TeacherList = require('../models/TeacherList');
const { cloudinary } = require('../config/cloudinary');

exports.getAllTeachers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { isActive: true };

    const teachers = await TeacherList.find(query)
      .sort({ order: 1, createdAt: -1 });

    let filteredTeachers = teachers;
    if (search) {
      filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(search.toLowerCase()) ||
        teacher.designation.toLowerCase().includes(search.toLowerCase()) ||
        (teacher.email && teacher.email.toLowerCase().includes(search.toLowerCase()))
      );
    }

    res.status(200).json({
      success: true,
      count: filteredTeachers.length,
      data: filteredTeachers
    });
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teachers',
      error: error.message
    });
  }
};

exports.getTeacher = async (req, res) => {
  try {
    const teacher = await TeacherList.findById(req.params.id);

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
    console.error('Get teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teacher',
      error: error.message
    });
  }
};

exports.createTeacher = async (req, res) => {
  try {
    const teacherData = { ...req.body };

    if (typeof teacherData.subjects === 'string') {
      teacherData.subjects = teacherData.subjects
        .split(',')
        .map(s => s.trim())
        .filter(s => s);
    }

    if (req.file) {
      teacherData.image = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    const teacher = await TeacherList.create(teacherData);

    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      data: teacher
    });
  } catch (error) {
    console.error('Create teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create teacher',
      error: error.message
    });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    let teacher = await TeacherList.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    const updateData = { ...req.body };

    if (typeof updateData.subjects === 'string') {
      updateData.subjects = updateData.subjects
        .split(',')
        .map(s => s.trim())
        .filter(s => s);
    }

    if (req.file) {
      if (teacher.image?.publicId) {
        try {
          await cloudinary.uploader.destroy(teacher.image.publicId);
        } catch (err) {
          console.error('Cloudinary delete error:', err);
        }
      }

      updateData.image = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    teacher = await TeacherList.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Teacher updated successfully',
      data: teacher
    });
  } catch (error) {
    console.error('Update teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update teacher',
      error: error.message
    });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await TeacherList.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    if (teacher.image?.publicId) {
      try {
        await cloudinary.uploader.destroy(teacher.image.publicId);
      } catch (err) {
        console.error('Cloudinary delete error:', err);
      }
    }

    await teacher.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Teacher deleted successfully'
    });
  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete teacher',
      error: error.message
    });
  }
};

exports.toggleTeacherStatus = async (req, res) => {
  try {
    const teacher = await TeacherList.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    teacher.isActive = !teacher.isActive;
    await teacher.save();

    res.status(200).json({
      success: true,
      message: `Teacher ${teacher.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { isActive: teacher.isActive }
    });
  } catch (error) {
    console.error('Toggle status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle status',
      error: error.message
    });
  }
};