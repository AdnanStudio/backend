const ClubMember = require('../models/ClubMember');
const { cloudinary } = require('../config/cloudinary');

exports.getAllMembers = async (req, res) => {
  try {
    const members = await ClubMember.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch members',
      error: error.message
    });
  }
};

exports.getMember = async (req, res) => {
  try {
    const member = await ClubMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch member',
      error: error.message
    });
  }
};

exports.createMember = async (req, res) => {
  try {
    const memberData = { ...req.body };

    if (req.file) {
      memberData.image = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    const member = await ClubMember.create(memberData);

    res.status(201).json({
      success: true,
      message: 'Member created successfully',
      data: member
    });
  } catch (error) {
    console.error('Create member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create member',
      error: error.message
    });
  }
};

exports.updateMember = async (req, res) => {
  try {
    let member = await ClubMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    const updateData = { ...req.body };

    if (req.file) {
      if (member.image?.publicId) {
        try {
          await cloudinary.uploader.destroy(member.image.publicId);
        } catch (err) {
          console.error('Cloudinary delete error:', err);
        }
      }

      updateData.image = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    member = await ClubMember.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Member updated successfully',
      data: member
    });
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update member',
      error: error.message
    });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const member = await ClubMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    if (member.image?.publicId) {
      try {
        await cloudinary.uploader.destroy(member.image.publicId);
      } catch (err) {
        console.error('Cloudinary delete error:', err);
      }
    }

    await member.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Member deleted successfully'
    });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete member',
      error: error.message
    });
  }
};

exports.toggleMemberStatus = async (req, res) => {
  try {
    const member = await ClubMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    member.isActive = !member.isActive;
    await member.save();

    res.status(200).json({
      success: true,
      message: `Member ${member.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { isActive: member.isActive }
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