const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Project = require('../models/Project');
const Application = require('../models/Application');

/**
 * @route   GET api/users/applied-internships
 * @desc    Get all internships applied by the user
 * @access  Private
 */
router.get('/applied-internships', auth, async (req, res) => {
  try {
    // Fetch user's applications from the database
    const applications = await Application.find({ user: req.user.id })
      .populate({
        path: 'internship',
        select: 'title company status description applicationDeadline',
        populate: {
          path: 'company',
          select: 'name logo'
        }
      })
      .sort({ createdAt: -1 });

    // Format the response
    const appliedInternships = applications.map(app => ({
      id: app.internship._id,
      title: app.internship.title,
      company: app.internship.company.name,
      status: app.status,
      applicationDate: app.createdAt,
      logo: app.internship.company.logo,
      description: app.internship.description,
      deadline: app.internship.applicationDeadline
    }));

    res.json(appliedInternships);
  } catch (err) {
    console.error('Error fetching applied internships:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET api/users/my-projects
 * @desc    Get all projects where the user is a participant
 * @access  Private
 */
router.get('/my-projects', auth, async (req, res) => {
  try {
    // Find projects where the user is a member
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { members: req.user.id }
      ]
    })
      .populate('owner', 'name avatar')
      .populate('members', 'name avatar')
      .sort({ updatedAt: -1 });

    // Format the response
    const formattedProjects = projects.map(project => ({
      id: project._id,
      title: project.title,
      description: project.description,
      status: project.status,
      teamSize: project.members.length + 1, // +1 for the owner
      image: project.image || null,
      owner: {
        id: project.owner._id,
        name: project.owner.name,
        avatar: project.owner.avatar
      },
      isOwner: project.owner._id.toString() === req.user.id
    }));

    res.json(formattedProjects);
  } catch (err) {
    console.error('Error fetching user projects:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 