import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Competency context
const CompetencyContext = createContext();

// Custom hook for using the competency context
export const useCompetency = () => {
  const context = useContext(CompetencyContext);
  if (!context) {
    throw new Error('useCompetency must be used within a CompetencyProvider');
  }
  return context;
};

// Competency Provider component
export const CompetencyProvider = ({ children }) => {
  const [competencyItems, setCompetencyItems] = useState([]);
  const [activities, setActivities] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [categoryScores, setCategoryScores] = useState([0, 0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);

  // Set next progression score goal
  const nextProgressionScore = 100;

  // Load competency items and activities on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load competences from Supabase
        const { getCompetences, getUserActivities } = await import('../services/activityService');

        const [competences, userActivities] = await Promise.all([
          getCompetences(),
          getUserActivities()
        ]);

        setCompetencyItems(competences || []);
        setActivities(userActivities || []);
      } catch (error) {
        console.error('Error loading data:', error);
        // Set empty arrays as fallback
        setCompetencyItems([]);
        setActivities([]);

        // Try to load from localStorage as backup
        const storedActivities = localStorage.getItem('activities');
        if (storedActivities) {
          try {
            const parsed = JSON.parse(storedActivities);
            if (Array.isArray(parsed)) {
              setActivities(parsed);
            }
          } catch (parseError) {
            console.error('Error parsing stored activities:', parseError);
            localStorage.removeItem('activities');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate total score and category scores whenever activities change
  useEffect(() => {
    if (!activities.length) {
      setTotalScore(0);
      setCategoryScores([0, 0, 0, 0, 0, 0]);
      return;
    }

    // Initialize category scores array (6 categories)
    const catScores = [0, 0, 0, 0, 0, 0];

    // Calculate total and category scores
    let total = 0;
    activities.forEach(activity => {
      total += activity.pontuacao || 0;

      // Get category from the activity or find the competence
      let categoryIndex = 0;
      if (activity.categoria) {
        categoryIndex = parseInt(activity.categoria) - 1;
      } else {
        const item = competencyItems.find(item => item.id === activity.itemCompetenciaId);
        if (item) {
          categoryIndex = parseInt(item.category) - 1;
        }
      }

      if (categoryIndex >= 0 && categoryIndex < catScores.length) {
        catScores[categoryIndex] += activity.pontuacao || 0;
      }
    });

    setTotalScore(total);
    setCategoryScores(catScores);
  }, [activities, competencyItems]);

  // Register a new activity
  const registerActivity = async (activityData) => {
    try {
      const { createActivity } = await import('../services/activityService');
      const newActivity = await createActivity(activityData);

      const updatedActivities = [...activities, newActivity];
      setActivities(updatedActivities);

      // Also save to localStorage as backup
      localStorage.setItem('activities', JSON.stringify(updatedActivities));

      return newActivity;
    } catch (error) {
      console.error('Error registering activity:', error);
      throw error;
    }
  };

  // Update an activity's status
  const updateActivityStatus = async (activityId, status, comments = '') => {
    try {
      const { updateActivityStatus: updateActivityStatusService } = await import('../services/activityService');
      await updateActivityStatusService(activityId, status, comments);

      const updatedActivities = activities.map(activity => {
        if (activity.id === activityId) {
          return {
            ...activity,
            status,
            observacoes: comments,
            updated_at: new Date().toISOString()
          };
        }
        return activity;
      });

      setActivities(updatedActivities);
      localStorage.setItem('activities', JSON.stringify(updatedActivities));
    } catch (error) {
      console.error('Error updating activity status:', error);
      throw error;
    }
  };

  // Get activity statistics
  const getActivityStats = () => {
    const total = activities.length;
    const approved = activities.filter(a => a.status === 'aprovada').length;
    const pending = activities.filter(a => a.status === 'pendente').length;
    const rejected = activities.filter(a => a.status === 'rejeitada').length;

    return { approved, pending, rejected, total };
  };

  // Get progress percentage
  const getProgressPercentage = () => {
    return Math.min((totalScore / nextProgressionScore) * 100, 100);
  };

  // Delete an activity
  const deleteActivity = async (activityId) => {
    try {
      const { deleteActivity: deleteActivityService } = await import('../services/activityService');
      await deleteActivityService(activityId);

      const updatedActivities = activities.filter(activity => activity.id !== activityId);
      setActivities(updatedActivities);
      localStorage.setItem('activities', JSON.stringify(updatedActivities));
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  };

  // Refresh data from server
  const refreshData = async () => {
    setLoading(true);
    try {
      const { getUserActivities } = await import('../services/activityService');
      const userActivities = await getUserActivities();
      setActivities(userActivities);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    competencyItems,
    activities,
    totalScore,
    categoryScores,
    nextProgressionScore,
    loading,
    registerActivity,
    updateActivityStatus,
    getActivityStats,
    getProgressPercentage,
    deleteActivity,
    refreshData
  };

  return (
    <CompetencyContext.Provider value={value}>
      {!loading && children}
    </CompetencyContext.Provider>
  );
};