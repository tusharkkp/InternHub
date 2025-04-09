const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');

/**
 * @route   POST api/projects/:id/leave
 * @desc    Leave a project the user is a member of
 * @access  Private
 */
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    
    // Check if user is the owner
    if (project.owner.toString() === req.user.id) {
      return res.status(400).json({ msg: 'Project owner cannot leave. Transfer ownership or delete the project instead.' });
    }
    
    // Check if user is a member
    if (!project.members.includes(req.user.id)) {
      return res.status(400).json({ msg: 'User is not a member of this project' });
    }
    
    // Remove user from members array
    project.members = project.members.filter(
      member => member.toString() !== req.user.id
    );
    
    await project.save();
    
    res.json({ msg: 'Successfully left the project' });
  } catch (err) {
    console.error('Error leaving project:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).send('Server Error');
  }
});

/**
 * @route   DELETE api/projects/:id
 * @desc    Delete a project
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    
    // Check if user is the owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to delete this project. Only the project owner can delete it.' });
    }
    
    // Use deleteOne instead of remove (which is deprecated)
    await Project.deleteOne({ _id: req.params.id });
    
    res.json({ msg: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router; 