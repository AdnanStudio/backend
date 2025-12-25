const Subject = require('../models/Subject');
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');

// ============ Get All Subjects ============
exports.getAllSubjects = async (req, res) => {
  try {
    const { search, department, isActive, class: classId } = req.query;
    
    let query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }

    // Department filter
    if (department) {
      query.department = department;
    }

    // Active status filter
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Class filter
    if (classId) {
      query.class = classId;
    }

    const subjects = await Subject.find(query)
      .populate('class', 'name section')
      .populate('teacher', 'name email')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects
    });

  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subjects',
      error: error.message
    });
  }
};

// ============ Get Single Subject ============
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate('class', 'name section')
      .populate('teacher', 'name email phone')
      .populate('createdBy', 'name email');

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    res.status(200).json({
      success: true,
      data: subject
    });

  } catch (error) {
    console.error('Error fetching subject:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subject',
      error: error.message
    });
  }
};

// ============ Create Subject ============
exports.createSubject = async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      department,
      class: classId,
      teacher,
      credits,
      type,
      passingMarks,
      totalMarks,
      isActive
    } = req.body;

    // Check if subject code already exists
    const existingSubject = await Subject.findOne({ 
      $or: [{ code: code.toUpperCase() }, { name }] 
    });

    if (existingSubject) {
      return res.status(400).json({
        success: false,
        message: 'Subject with this name or code already exists'
      });
    }

    // Validate class if provided
    if (classId) {
      const classExists = await Class.findById(classId);
      if (!classExists) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }
    }

    // Validate teacher if provided
    if (teacher) {
      const teacherExists = await Teacher.findById(teacher);
      if (!teacherExists) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }
    }

    const subject = await Subject.create({
      name,
      code: code.toUpperCase(),
      description,
      department,
      class: classId || null,
      teacher: teacher || null,
      credits,
      type,
      passingMarks,
      totalMarks,
      isActive,
      createdBy: req.user._id
    });

    const populatedSubject = await Subject.findById(subject._id)
      .populate('class', 'name section')
      .populate('teacher', 'name email')
      .populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: populatedSubject
    });

  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating subject',
      error: error.message
    });
  }
};

// ============ Update Subject ============
exports.updateSubject = async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      department,
      class: classId,
      teacher,
      credits,
      type,
      passingMarks,
      totalMarks,
      isActive
    } = req.body;

    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Check if new code/name conflicts with another subject
    if (code || name) {
      const existingSubject = await Subject.findOne({
        _id: { $ne: req.params.id },
        $or: [
          { code: code ? code.toUpperCase() : subject.code },
          { name: name || subject.name }
        ]
      });

      if (existingSubject) {
        return res.status(400).json({
          success: false,
          message: 'Another subject with this name or code already exists'
        });
      }
    }

    // Validate class if provided
    if (classId) {
      const classExists = await Class.findById(classId);
      if (!classExists) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }
    }

    // Validate teacher if provided
    if (teacher) {
      const teacherExists = await Teacher.findById(teacher);
      if (!teacherExists) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }
    }

    // Update fields
    if (name) subject.name = name;
    if (code) subject.code = code.toUpperCase();
    if (description !== undefined) subject.description = description;
    if (department) subject.department = department;
    if (classId !== undefined) subject.class = classId || null;
    if (teacher !== undefined) subject.teacher = teacher || null;
    if (credits) subject.credits = credits;
    if (type) subject.type = type;
    if (passingMarks !== undefined) subject.passingMarks = passingMarks;
    if (totalMarks !== undefined) subject.totalMarks = totalMarks;
    if (isActive !== undefined) subject.isActive = isActive;

    await subject.save();

    const updatedSubject = await Subject.findById(subject._id)
      .populate('class', 'name section')
      .populate('teacher', 'name email')
      .populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      message: 'Subject updated successfully',
      data: updatedSubject
    });

  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating subject',
      error: error.message
    });
  }
};

// ============ Delete Subject ============
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    await Subject.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting subject',
      error: error.message
    });
  }
};

// ============ Get Subjects by Class ============
exports.getSubjectsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const subjects = await Subject.find({ class: classId, isActive: true })
      .populate('teacher', 'name email')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects
    });

  } catch (error) {
    console.error('Error fetching subjects by class:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subjects',
      error: error.message
    });
  }
};

// ============ Get Subjects by Teacher ============
exports.getSubjectsByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const subjects = await Subject.find({ teacher: teacherId, isActive: true })
      .populate('class', 'name section')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects
    });

  } catch (error) {
    console.error('Error fetching subjects by teacher:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subjects',
      error: error.message
    });
  }
};

// ============ Toggle Subject Status ============
exports.toggleSubjectStatus = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    subject.isActive = !subject.isActive;
    await subject.save();

    res.status(200).json({
      success: true,
      message: `Subject ${subject.isActive ? 'activated' : 'deactivated'} successfully`,
      data: subject
    });

  } catch (error) {
    console.error('Error toggling subject status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating subject status',
      error: error.message
    });
  }
};