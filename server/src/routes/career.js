const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { analyzeUserProfile, getSkillGaps, getLearningResources, matchInternships, matchProjects } = require('../services/careerService');

// @route   GET api/career/recommendations/:userId
// @desc    Get personalized career recommendations
// @access  Private
router.get('/recommendations/:userId', auth, async (req, res) => {
  try {
    const recommendations = await analyzeUserProfile(req.params.userId);
    res.json(recommendations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/career/skill-gaps
// @desc    Analyze skill gaps for a target role
// @access  Private
router.post(
  '/skill-gaps',
  [
    auth,
    [
      body('userId', 'User ID is required').not().isEmpty(),
      body('targetRole', 'Target role is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { userId, targetRole } = req.body;
      const skillGaps = await getSkillGaps(userId, targetRole);
      res.json(skillGaps);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/career/learning-resources
// @desc    Get learning resources for a specific skill
// @access  Private
router.get('/learning-resources', auth, async (req, res) => {
  try {
    const { skill } = req.query;
    const resources = await getLearningResources(skill);
    res.json(resources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/career/internship-matches/:userId
// @desc    Get matched internships for a user
// @access  Private
router.get('/internship-matches/:userId', auth, async (req, res) => {
  try {
    const matches = await matchInternships(req.params.userId);
    res.json(matches);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/career/project-matches/:userId
// @desc    Get matched projects for a user
// @access  Private
router.get('/project-matches/:userId', auth, async (req, res) => {
  try {
    const matches = await matchProjects(req.params.userId);
    res.json(matches);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/career/preferences/:userId
// @desc    Update user's career preferences
// @access  Private
router.put(
  '/preferences/:userId',
  [
    auth,
    [
      body('preferences', 'Preferences are required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { preferences } = req.body;
      const updatedPreferences = await updateCareerPreferences(req.params.userId, preferences);
      res.json(updatedPreferences);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router; 