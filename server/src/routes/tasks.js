const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

/**
 * @route   GET api/tasks/project/:projectId
 * @desc    Get all tasks for a project
 * @access  Private
 */
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    // Check if user is member of the project
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // User must be either owner or member of the project
    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.members.some(member => member.toString() === req.user.id);
    
    if (!isOwner && !isMember) {
      return res.status(401).json({ msg: 'Not authorized to view tasks for this project' });
    }

    // Get all tasks for this project
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name avatar skills')
      .populate('createdBy', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error('Error fetching project tasks:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET api/tasks/user
 * @desc    Get all tasks assigned to the current user
 * @access  Private
 */
router.get('/user', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate('project', 'title description status')
      .populate('createdBy', 'name avatar')
      .sort({ dueDate: 1, status: 1 });

    res.json(tasks);
  } catch (err) {
    console.error('Error fetching user tasks:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post('/', auth, async (req, res) => {
  const { title, description, requiredSkills, projectId, dueDate, priority } = req.body;

  try {
    // Check if user is authorized to create tasks in this project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    const isOwner = project.owner.toString() === req.user.id;
    
    if (!isOwner) {
      return res.status(401).json({ msg: 'Only the project owner can create tasks' });
    }

    // Create new task
    const newTask = new Task({
      title,
      description,
      requiredSkills: requiredSkills || [],
      project: projectId,
      createdBy: req.user.id,
      dueDate,
      priority: priority || 'Medium'
    });

    const task = await newTask.save();

    // If task is successfully created, return it with populated fields
    const populatedTask = await Task.findById(task._id)
      .populate('createdBy', 'name avatar')
      .populate('project', 'title');

    res.json(populatedTask);
  } catch (err) {
    console.error('Error creating task:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   PUT api/tasks/:id
 * @desc    Update a task
 * @access  Private
 */
router.put('/:id', auth, async (req, res) => {
  const { title, description, status, requiredSkills, assignedTo, dueDate, priority } = req.body;

  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Check if user is authorized to update this task
    const project = await Project.findById(task.project);
    const isOwner = project.owner.toString() === req.user.id;
    const isAssignee = task.assignedTo && task.assignedTo.toString() === req.user.id;
    
    if (!isOwner && !isAssignee) {
      return res.status(401).json({ msg: 'Not authorized to update this task' });
    }

    // If the user is the assignee but not the owner, they can only update the status
    if (isAssignee && !isOwner && (title || description || requiredSkills || assignedTo || dueDate || priority)) {
      return res.status(401).json({ msg: 'Assignees can only update the task status' });
    }

    // If status is being updated to 'Completed', set completed flag
    if (status === 'Completed') {
      task.completed = true;
    } else if (status) {
      task.completed = false;
    }

    // Update the task fields
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (requiredSkills) task.requiredSkills = requiredSkills;
    if (assignedTo) task.assignedTo = assignedTo;
    if (dueDate) task.dueDate = dueDate;
    if (priority) task.priority = priority;

    await task.save();

    // Return the updated task with populated fields
    const updatedTask = await Task.findById(req.params.id)
      .populate('assignedTo', 'name avatar skills')
      .populate('createdBy', 'name avatar')
      .populate('project', 'title');

    res.json(updatedTask);
  } catch (err) {
    console.error('Error updating task:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   DELETE api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Check if user is authorized to delete this task
    const project = await Project.findById(task.project);
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to delete this task' });
    }

    await Task.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error('Error deleting task:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST api/tasks/assign-ai/:projectId
 * @desc    Use AI to assign tasks to project members based on skills
 * @access  Private
 */
router.post('/assign-ai/:projectId', auth, async (req, res) => {
  try {
    // Check if user is the project owner
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Only the project owner can auto-assign tasks' });
    }

    // Get all unassigned tasks for this project
    const unassignedTasks = await Task.find({
      project: req.params.projectId,
      assignedTo: { $exists: false }
    });

    if (unassignedTasks.length === 0) {
      return res.status(400).json({ msg: 'No unassigned tasks to allocate' });
    }

    // Get all project members including the owner
    const memberIds = [...project.members, project.owner];
    const members = await User.find({ _id: { $in: memberIds } });

    // Assign tasks based on skill matching
    const assignments = [];

    for (const task of unassignedTasks) {
      let bestMatch = null;
      let highestScore = -1;

      for (const member of members) {
        // Calculate skill match score (0-100)
        let score = 0;
        const memberSkills = member.skills || [];
        const requiredSkills = task.requiredSkills || [];

        if (requiredSkills.length === 0) {
          // If no specific skills are required, give all members an equal chance
          score = 50;
        } else {
          // Count matching skills
          let matchingSkills = 0;
          for (const skill of requiredSkills) {
            if (memberSkills.includes(skill)) {
              matchingSkills++;
            }
          }
          
          // Calculate percentage match
          score = requiredSkills.length > 0 
            ? (matchingSkills / requiredSkills.length) * 100 
            : 50;
        }

        // Track the best match
        if (score > highestScore) {
          highestScore = score;
          bestMatch = member;
        }
      }

      // Assign the task to the best matching member
      if (bestMatch) {
        task.assignedTo = bestMatch._id;
        task.skillMatchPercentage = highestScore;
        await task.save();
        
        assignments.push({
          taskId: task._id,
          taskTitle: task.title,
          assignedTo: {
            id: bestMatch._id,
            name: bestMatch.name
          },
          matchPercentage: highestScore
        });
      }
    }

    res.json({
      msg: `${assignments.length} tasks have been auto-assigned`,
      assignments
    });
  } catch (err) {
    console.error('Error in AI task assignment:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 