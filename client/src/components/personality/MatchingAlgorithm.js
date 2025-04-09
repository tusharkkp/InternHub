/**
 * MatchingAlgorithm.js
 * 
 * This utility provides functions to calculate compatibility between users
 * based on their personality profiles (MBTI types and Big Five traits).
 */

// MBTI compatibility matrix
// Higher values (0-10) indicate more compatibility between types
const mbtiCompatibilityMatrix = {
  // Analysts (NT)
  'INTJ': {
    'INTJ': 6, 'INTP': 6, 'ENTJ': 8, 'ENTP': 7, // Fellow analysts
    'INFJ': 7, 'INFP': 6, 'ENFJ': 7, 'ENFP': 6, // Diplomats
    'ISTJ': 5, 'ISFJ': 4, 'ESTJ': 6, 'ESFJ': 4, // Sentinels
    'ISTP': 5, 'ISFP': 4, 'ESTP': 4, 'ESFP': 3  // Explorers
  },
  'INTP': {
    'INTJ': 6, 'INTP': 5, 'ENTJ': 7, 'ENTP': 8, // Fellow analysts
    'INFJ': 6, 'INFP': 7, 'ENFJ': 6, 'ENFP': 7, // Diplomats
    'ISTJ': 5, 'ISFJ': 4, 'ESTJ': 4, 'ESFJ': 3, // Sentinels
    'ISTP': 6, 'ISFP': 5, 'ESTP': 5, 'ESFP': 4  // Explorers
  },
  'ENTJ': {
    'INTJ': 8, 'INTP': 7, 'ENTJ': 6, 'ENTP': 6, // Fellow analysts
    'INFJ': 7, 'INFP': 6, 'ENFJ': 7, 'ENFP': 6, // Diplomats
    'ISTJ': 7, 'ISFJ': 5, 'ESTJ': 7, 'ESFJ': 5, // Sentinels
    'ISTP': 5, 'ISFP': 4, 'ESTP': 6, 'ESFP': 4  // Explorers
  },
  'ENTP': {
    'INTJ': 7, 'INTP': 8, 'ENTJ': 6, 'ENTP': 5, // Fellow analysts
    'INFJ': 6, 'INFP': 6, 'ENFJ': 6, 'ENFP': 7, // Diplomats
    'ISTJ': 4, 'ISFJ': 3, 'ESTJ': 5, 'ESFJ': 4, // Sentinels
    'ISTP': 6, 'ISFP': 4, 'ESTP': 7, 'ESFP': 6  // Explorers
  },
  // Diplomats (NF)
  'INFJ': {
    'INTJ': 7, 'INTP': 6, 'ENTJ': 7, 'ENTP': 6, // Analysts
    'INFJ': 6, 'INFP': 6, 'ENFJ': 7, 'ENFP': 7, // Fellow diplomats
    'ISTJ': 4, 'ISFJ': 5, 'ESTJ': 4, 'ESFJ': 6, // Sentinels
    'ISTP': 4, 'ISFP': 5, 'ESTP': 3, 'ESFP': 4  // Explorers
  },
  'INFP': {
    'INTJ': 6, 'INTP': 7, 'ENTJ': 6, 'ENTP': 6, // Analysts
    'INFJ': 6, 'INFP': 5, 'ENFJ': 8, 'ENFP': 6, // Fellow diplomats
    'ISTJ': 4, 'ISFJ': 5, 'ESTJ': 3, 'ESFJ': 5, // Sentinels
    'ISTP': 4, 'ISFP': 6, 'ESTP': 3, 'ESFP': 5  // Explorers
  },
  'ENFJ': {
    'INTJ': 7, 'INTP': 6, 'ENTJ': 7, 'ENTP': 6, // Analysts
    'INFJ': 7, 'INFP': 8, 'ENFJ': 6, 'ENFP': 7, // Fellow diplomats
    'ISTJ': 5, 'ISFJ': 6, 'ESTJ': 5, 'ESFJ': 7, // Sentinels
    'ISTP': 4, 'ISFP': 5, 'ESTP': 5, 'ESFP': 6  // Explorers
  },
  'ENFP': {
    'INTJ': 6, 'INTP': 7, 'ENTJ': 6, 'ENTP': 7, // Analysts
    'INFJ': 7, 'INFP': 6, 'ENFJ': 7, 'ENFP': 6, // Fellow diplomats
    'ISTJ': 4, 'ISFJ': 5, 'ESTJ': 4, 'ESFJ': 6, // Sentinels
    'ISTP': 4, 'ISFP': 5, 'ESTP': 5, 'ESFP': 6  // Explorers
  },
  // Sentinels (SJ)
  'ISTJ': {
    'INTJ': 5, 'INTP': 5, 'ENTJ': 7, 'ENTP': 4, // Analysts
    'INFJ': 4, 'INFP': 4, 'ENFJ': 5, 'ENFP': 4, // Diplomats
    'ISTJ': 6, 'ISFJ': 6, 'ESTJ': 7, 'ESFJ': 6, // Fellow sentinels
    'ISTP': 6, 'ISFP': 5, 'ESTP': 5, 'ESFP': 4  // Explorers
  },
  'ISFJ': {
    'INTJ': 4, 'INTP': 4, 'ENTJ': 5, 'ENTP': 3, // Analysts
    'INFJ': 5, 'INFP': 5, 'ENFJ': 6, 'ENFP': 5, // Diplomats
    'ISTJ': 6, 'ISFJ': 6, 'ESTJ': 6, 'ESFJ': 7, // Fellow sentinels
    'ISTP': 5, 'ISFP': 6, 'ESTP': 4, 'ESFP': 5  // Explorers
  },
  'ESTJ': {
    'INTJ': 6, 'INTP': 4, 'ENTJ': 7, 'ENTP': 5, // Analysts
    'INFJ': 4, 'INFP': 3, 'ENFJ': 5, 'ENFP': 4, // Diplomats
    'ISTJ': 7, 'ISFJ': 6, 'ESTJ': 6, 'ESFJ': 6, // Fellow sentinels
    'ISTP': 5, 'ISFP': 4, 'ESTP': 6, 'ESFP': 5  // Explorers
  },
  'ESFJ': {
    'INTJ': 4, 'INTP': 3, 'ENTJ': 5, 'ENTP': 4, // Analysts
    'INFJ': 6, 'INFP': 5, 'ENFJ': 7, 'ENFP': 6, // Diplomats
    'ISTJ': 6, 'ISFJ': 7, 'ESTJ': 6, 'ESFJ': 6, // Fellow sentinels
    'ISTP': 4, 'ISFP': 5, 'ESTP': 5, 'ESFP': 6  // Explorers
  },
  // Explorers (SP)
  'ISTP': {
    'INTJ': 5, 'INTP': 6, 'ENTJ': 5, 'ENTP': 6, // Analysts
    'INFJ': 4, 'INFP': 4, 'ENFJ': 4, 'ENFP': 4, // Diplomats
    'ISTJ': 6, 'ISFJ': 5, 'ESTJ': 5, 'ESFJ': 4, // Sentinels
    'ISTP': 6, 'ISFP': 6, 'ESTP': 7, 'ESFP': 6  // Fellow explorers
  },
  'ISFP': {
    'INTJ': 4, 'INTP': 5, 'ENTJ': 4, 'ENTP': 4, // Analysts
    'INFJ': 5, 'INFP': 6, 'ENFJ': 5, 'ENFP': 5, // Diplomats
    'ISTJ': 5, 'ISFJ': 6, 'ESTJ': 4, 'ESFJ': 5, // Sentinels
    'ISTP': 6, 'ISFP': 6, 'ESTP': 6, 'ESFP': 7  // Fellow explorers
  },
  'ESTP': {
    'INTJ': 4, 'INTP': 5, 'ENTJ': 6, 'ENTP': 7, // Analysts
    'INFJ': 3, 'INFP': 3, 'ENFJ': 5, 'ENFP': 5, // Diplomats
    'ISTJ': 5, 'ISFJ': 4, 'ESTJ': 6, 'ESFJ': 5, // Sentinels
    'ISTP': 7, 'ISFP': 6, 'ESTP': 6, 'ESFP': 7  // Fellow explorers
  },
  'ESFP': {
    'INTJ': 3, 'INTP': 4, 'ENTJ': 4, 'ENTP': 6, // Analysts
    'INFJ': 4, 'INFP': 5, 'ENFJ': 6, 'ENFP': 6, // Diplomats
    'ISTJ': 4, 'ISFJ': 5, 'ESTJ': 5, 'ESFJ': 6, // Sentinels
    'ISTP': 6, 'ISFP': 7, 'ESTP': 7, 'ESFP': 6  // Fellow explorers
  }
};

// Team role compatibility based on MBTI
const teamRolesByType = {
  // Analysts
  'INTJ': ['Strategist', 'Architect', 'Systems Designer'],
  'INTP': ['Innovator', 'Theorist', 'System Analyst'],
  'ENTJ': ['Leader', 'Executive', 'Director'],
  'ENTP': ['Visionary', 'Inventor', 'Entrepreneur'],
  
  // Diplomats
  'INFJ': ['Counselor', 'Mentor', 'Harmonizer'],
  'INFP': ['Idealist', 'Humanist', 'Creative Writer'],
  'ENFJ': ['Coach', 'Facilitator', 'People Developer'],
  'ENFP': ['Motivator', 'Catalyst', 'Creative Consultant'],
  
  // Sentinels
  'ISTJ': ['Inspector', 'Auditor', 'Logistician'],
  'ISFJ': ['Protector', 'Supporter', 'Caretaker'],
  'ESTJ': ['Supervisor', 'Administrator', 'Project Manager'],
  'ESFJ': ['Provider', 'Caregiver', 'Team Builder'],
  
  // Explorers
  'ISTP': ['Craftsman', 'Troubleshooter', 'Technical Specialist'],
  'ISFP': ['Artist', 'Designer', 'Composer'],
  'ESTP': ['Promoter', 'Negotiator', 'Tactical Operator'],
  'ESFP': ['Performer', 'Entertainer', 'Team Morale Builder']
};

// Skills that generally align well with each MBTI type
const skillAffinitiesByType = {
  // Analysts
  'INTJ': ['Strategic Planning', 'Systems Design', 'Data Analysis', 'Research', 'Problem Solving'],
  'INTP': ['Theoretical Analysis', 'Programming', 'Research', 'Complex Problem Solving', 'Model Development'],
  'ENTJ': ['Leadership', 'Project Management', 'Strategic Planning', 'Decision Making', 'Organizational Development'],
  'ENTP': ['Innovation', 'Creative Problem Solving', 'Debate', 'Brainstorming', 'Systems Analysis'],
  
  // Diplomats
  'INFJ': ['Counseling', 'Writing', 'Strategic Vision', 'People Development', 'Conflict Resolution'],
  'INFP': ['Creative Writing', 'Artistic Expression', 'Values-Based Design', 'Individual Counseling', 'Editing'],
  'ENFJ': ['Team Building', 'Public Speaking', 'Teaching', 'Coaching', 'Interpersonal Communication'],
  'ENFP': ['Creative Ideation', 'Public Relations', 'Motivational Speaking', 'Networking', 'Facilitation'],
  
  // Sentinels
  'ISTJ': ['Data Management', 'Quality Control', 'Process Improvement', 'Documentation', 'Systematic Analysis'],
  'ISFJ': ['Patient Care', 'Administrative Support', 'Detail Management', 'Service Coordination', 'Record Keeping'],
  'ESTJ': ['Project Management', 'Operational Planning', 'Policy Implementation', 'Process Supervision', 'Resource Allocation'],
  'ESFJ': ['Customer Service', 'Team Support', 'Event Planning', 'Community Building', 'Coordination'],
  
  // Explorers
  'ISTP': ['Technical Troubleshooting', 'Mechanical Skills', 'Crisis Response', 'Tool/Technology Use', 'Tactical Problem Solving'],
  'ISFP': ['Artistic Design', 'Hands-on Crafting', 'Aesthetic Appreciation', 'Harmonious Design', 'Creative Expression'],
  'ESTP': ['Negotiation', 'Crisis Management', 'Sales', 'Entrepreneurship', 'Physical/Technical Skills'],
  'ESFP': ['Performance', 'Team Morale', 'Customer Engagement', 'Presentation', 'Entertainment']
};

// Calculate MBTI compatibility score (0-100)
export const calculateMbtiCompatibility = (type1, type2) => {
  // If either type is not defined, return a default medium compatibility
  if (!type1 || !type2) return 50;
  
  // Normalize to uppercase
  type1 = type1.toUpperCase();
  type2 = type2.toUpperCase();
  
  // If types don't exist in the matrix, return a default value
  if (!mbtiCompatibilityMatrix[type1] || !mbtiCompatibilityMatrix[type1][type2]) {
    return 50;
  }
  
  // Convert the 0-10 scale to 0-100
  return mbtiCompatibilityMatrix[type1][type2] * 10;
};

// Calculate Big Five compatibility (0-100)
export const calculateBigFiveCompatibility = (profile1, profile2) => {
  // If either profile is not defined or missing Big Five traits, return a default value
  if (!profile1?.bigFiveTraits || !profile2?.bigFiveTraits) return 50;
  
  const traits1 = profile1.bigFiveTraits;
  const traits2 = profile2.bigFiveTraits;
  
  // Calculate complementary scores for each trait
  // Some traits work well when similar (e.g., conscientiousness), 
  // others when complementary (e.g., extraversion)
  
  // For extraversion: moderate difference is ideal (not too similar, not too opposite)
  const extraversionScore = 100 - Math.min(Math.abs(traits1.extraversion - traits2.extraversion), 50);
  
  // For agreeableness: higher combined scores are better
  const agreeablenessScore = (traits1.agreeableness + traits2.agreeableness) / 2;
  
  // For conscientiousness: similar levels work better
  const conscientiousnessScore = 100 - Math.abs(traits1.conscientiousness - traits2.conscientiousness);
  
  // For neuroticism: lower combined scores are better
  const neuroticismScore = 100 - (traits1.neuroticism + traits2.neuroticism) / 2;
  
  // For openness: some difference is good, but not extreme
  const opennessScore = 100 - Math.abs(traits1.openness - traits2.openness) * 0.8;
  
  // Weight the traits differently based on their importance for team collaboration
  const weightedScore = (
    extraversionScore * 0.2 +
    agreeablenessScore * 0.25 +
    conscientiousnessScore * 0.25 +
    neuroticismScore * 0.15 +
    opennessScore * 0.15
  );
  
  // Return rounded score
  return Math.round(weightedScore);
};

// Calculate overall compatibility that combines MBTI and Big Five
export const calculateOverallCompatibility = (profile1, profile2) => {
  // Calculate both compatibility scores
  const mbtiScore = calculateMbtiCompatibility(
    profile1?.personality?.type,
    profile2?.personality?.type
  );
  
  const bigFiveScore = calculateBigFiveCompatibility(
    profile1?.personality,
    profile2?.personality
  );
  
  // Weight MBTI and Big Five scores (giving slightly more weight to Big Five)
  const overallScore = Math.round(mbtiScore * 0.4 + bigFiveScore * 0.6);
  
  return {
    overall: overallScore,
    mbti: mbtiScore,
    bigFive: bigFiveScore
  };
};

// Get potential team roles based on personality type
export const getPotentialRoles = (personalityType) => {
  if (!personalityType) return [];
  
  return teamRolesByType[personalityType.toUpperCase()] || [];
};

// Get skill affinities based on personality type
export const getSkillAffinities = (personalityType) => {
  if (!personalityType) return [];
  
  return skillAffinitiesByType[personalityType.toUpperCase()] || [];
};

// Evaluate skill match with personality type (0-100)
export const evaluateSkillMatch = (skills, personalityType) => {
  if (!skills || !skills.length || !personalityType) return 50;
  
  const affinities = getSkillAffinities(personalityType);
  
  // No affinities found for this type
  if (!affinities || !affinities.length) return 50;
  
  // Count how many of the user's skills match their personality affinities
  let matchCount = 0;
  
  skills.forEach(skill => {
    // Check if any affinity contains this skill (case insensitive)
    const skillLower = typeof skill === 'string' ? skill.toLowerCase() : 
                      (skill.name ? skill.name.toLowerCase() : '');
    
    if (affinities.some(affinity => affinity.toLowerCase().includes(skillLower) || 
                                   skillLower.includes(affinity.toLowerCase()))) {
      matchCount++;
    }
  });
  
  // Calculate match percentage
  const matchPercentage = (matchCount / skills.length) * 100;
  
  // Blend with a baseline score to avoid extremes
  return Math.round((matchPercentage * 0.7) + 30);
};

// Find ideal team members based on personality
export const findIdealTeammates = (userProfile, potentialTeammates, projectRequirements = null) => {
  if (!userProfile || !potentialTeammates || !potentialTeammates.length) {
    return [];
  }
  
  // Calculate compatibility scores for each potential teammate
  const scoredTeammates = potentialTeammates.map(teammate => {
    // Calculate personality compatibility
    const compatibility = calculateOverallCompatibility(userProfile, teammate);
    
    // If project has specific skill requirements, factor those in
    let skillMatchScore = 50;
    if (projectRequirements && projectRequirements.requiredSkills) {
      // Check how many required skills the teammate has
      const requiredSkillsCount = projectRequirements.requiredSkills.length;
      let matchedSkillsCount = 0;
      
      projectRequirements.requiredSkills.forEach(requiredSkill => {
        const requiredSkillLower = requiredSkill.toLowerCase();
        
        if (teammate.skills && teammate.skills.some(skill => {
          const skillName = typeof skill === 'string' ? skill : (skill.name || '');
          return skillName.toLowerCase().includes(requiredSkillLower) ||
                 requiredSkillLower.includes(skillName.toLowerCase());
        })) {
          matchedSkillsCount++;
        }
      });
      
      // Calculate skill match percentage
      skillMatchScore = requiredSkillsCount > 0 
        ? Math.round((matchedSkillsCount / requiredSkillsCount) * 100)
        : 50;
    }
    
    // Combine compatibility and skill scores (weighted)
    const finalScore = Math.round(compatibility.overall * 0.6 + skillMatchScore * 0.4);
    
    return {
      ...teammate,
      compatibilityScore: finalScore,
      personalityCompatibility: compatibility,
      skillMatchScore,
      potentialRoles: getPotentialRoles(teammate?.personality?.type || '')
    };
  });
  
  // Sort by compatibility score (highest first)
  return scoredTeammates.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
};

// Find ideal internships/projects based on personality and skills
export const findIdealOpportunities = (userProfile, opportunities) => {
  if (!userProfile || !opportunities || !opportunities.length) {
    return [];
  }
  
  const personalityType = userProfile?.personality?.type;
  const userSkills = userProfile?.skills || [];
  
  // Get skill affinities for this personality type
  const skillAffinities = getSkillAffinities(personalityType);
  
  // Score each opportunity
  const scoredOpportunities = opportunities.map(opportunity => {
    // Check required skills match
    const requiredSkills = opportunity.requiredSkills || [];
    let skillMatchCount = 0;
    
    requiredSkills.forEach(requiredSkill => {
      const requiredSkillLower = requiredSkill.toLowerCase();
      
      if (userSkills.some(skill => {
        const skillName = typeof skill === 'string' ? skill : (skill.name || '');
        return skillName.toLowerCase().includes(requiredSkillLower) ||
               requiredSkillLower.includes(skillName.toLowerCase());
      })) {
        skillMatchCount++;
      }
    });
    
    // Calculate skill match percentage
    const skillMatchScore = requiredSkills.length > 0 
      ? Math.round((skillMatchCount / requiredSkills.length) * 100)
      : 50;
    
    // Check if the opportunity aligns with personality affinities
    let affinityScore = 50;
    if (skillAffinities && skillAffinities.length) {
      let affinityMatchCount = 0;
      
      // For each required skill, check if it matches any personality affinity
      requiredSkills.forEach(requiredSkill => {
        const requiredSkillLower = requiredSkill.toLowerCase();
        
        if (skillAffinities.some(affinity => 
            affinity.toLowerCase().includes(requiredSkillLower) ||
            requiredSkillLower.includes(affinity.toLowerCase()))) {
          affinityMatchCount++;
        }
      });
      
      // Calculate affinity match percentage
      affinityScore = requiredSkills.length > 0 
        ? Math.round((affinityMatchCount / requiredSkills.length) * 100)
        : 50;
    }
    
    // Calculate final score (weighted)
    const finalScore = Math.round(skillMatchScore * 0.7 + affinityScore * 0.3);
    
    return {
      ...opportunity,
      matchScore: finalScore,
      skillMatchScore,
      affinityScore
    };
  });
  
  // Sort by match score (highest first)
  return scoredOpportunities.sort((a, b) => b.matchScore - a.matchScore);
};

export default {
  calculateMbtiCompatibility,
  calculateBigFiveCompatibility,
  calculateOverallCompatibility,
  getPotentialRoles,
  getSkillAffinities,
  evaluateSkillMatch,
  findIdealTeammates,
  findIdealOpportunities
}; 