import React, { createContext, useContext, useState, useEffect } from 'react';
import { competencyItems as itemsData } from '../data/competencyItems';

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
    // Load competency items from data
    setCompetencyItems(itemsData);
    
    // Load saved activities from localStorage
    const storedActivities = localStorage.getItem('activities');
    if (storedActivities) {
      try {
        const parsed = JSON.parse(storedActivities);
        setActivities(parsed);
      } catch (error) {
        console.error('Error parsing stored activities:', error);
        localStorage.removeItem('activities');
      }
    }
    
    setLoading(false);
  }, []);
  
  // Calculate total score and category scores whenever activities change
  useEffect(() => {
    if (!activities.length) {
      setTotalScore(0);
      setCategoryScores([0, 0, 0, 0, 0, 0]);
      return;
    }
    
    // Initialize category scores array
    const catScores = [0, 0, 0, 0, 0, 0];
    
    // Calculate total and category scores
    let total = 0;
    activities.forEach(activity => {
      // Only count approved or pending activities
      if (activity.status !== 'rejeitada') {
        total += activity.pontuacao;
        
        // Get the item to determine its category
        const item = competencyItems.find(item => item.id === activity.itemCompetenciaId);
        if (item) {
          // Categories are 1-indexed in the data, so we subtract 1
          const categoryIndex = item.categoria - 1;
          if (categoryIndex >= 0 && categoryIndex < catScores.length) {
            catScores[categoryIndex] += activity.pontuacao;
          }
        }
      }
    });
    
    setTotalScore(total);
    setCategoryScores(catScores);
  }, [activities, competencyItems]);
  
  // Register a new activity
  const registerActivity = (activityData) => {
    const newActivity = {
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      ...activityData,
      dataRegistro: new Date().toISOString(),
    };
    
    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities);
    
    // Save to localStorage
    localStorage.setItem('activities', JSON.stringify(updatedActivities));
    
    return newActivity;
  };
  
  // Update an activity's status (e.g., when approved or rejected)
  const updateActivityStatus = (activityId, status, comments = '') => {
    const updatedActivities = activities.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          status,
          observacoes: comments,
          dataAtualizacao: new Date().toISOString()
        };
      }
      return activity;
    });
    
    setActivities(updatedActivities);
    localStorage.setItem('activities', JSON.stringify(updatedActivities));
  };
  
  // Delete an activity
  const deleteActivity = (activityId) => {
    const updatedActivities = activities.filter(activity => activity.id !== activityId);
    setActivities(updatedActivities);
    localStorage.setItem('activities', JSON.stringify(updatedActivities));
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
    deleteActivity
  };
  
  return (
    <CompetencyContext.Provider value={value}>
      {!loading && children}
    </CompetencyContext.Provider>
  );
};