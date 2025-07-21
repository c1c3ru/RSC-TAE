
import { useState, useEffect } from 'react';
import { useCompetency } from '../context/CompetencyContext';
import CategoryDistribution from '../components/Dashboard/CategoryDistribution';
import ScoreCard from '../components/Dashboard/ScoreCard';
import ActivityList from '../components/ActivityForm/ActivityList';
import LevelRequirements from '../components/Dashboard/LevelRequirements';
import ProcessSteps from '../components/Dashboard/ProcessSteps';

import { DASHBOARD_TEXTS } from '../constants/texts';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { getUserActivityStats } from '../services/activityService';

import Lottie from 'lottie-react';
import dashboardAnimation from '../assets/lottie/dashboard_animation.json';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { loading } = useCompetency();
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    totalActivities: 0,
    activitiesByCategory: {} as Record<string, number>,
    pointsByCategory: {} as Record<string, number>,
    categoryNames: {} as Record<string, string>
  });
  const [loadingStats, setLoadingStats] = useState(true);


  useEffect(() => {
    supabase.auth.getSession().then(() => {
      // JWT do usuário pode ser usado aqui se necessário
    });
  }, []);

  useEffect(() => {
    const loadUserStats = async () => {
      if (currentUser) {
        try {
          setLoadingStats(true);
          const stats = await getUserActivityStats(currentUser.id);
          setUserStats(stats);
        } catch (error) {
          console.error('Error loading user stats:', error);
        } finally {
          setLoadingStats(false);
        }
      }
    };

    loadUserStats();
  }, [currentUser]);

  // Calcular número de categorias únicas
  const uniqueCategories = Object.keys(userStats.activitiesByCategory || {}).length;
  


  // Determinar etapa atual
  const getCurrentStep = (): number => {
    if (userStats.totalActivities === 0) return 1;
    if (userStats.totalActivities > 0) return 2;
    return 1;
  };

  if (loading || loadingStats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn">
        <div className="mb-6">
          <Lottie animationData={dashboardAnimation} style={{ width: 180, height: 180 }} />
        </div>
        <div className="space-y-6 w-full max-w-xl">
          <div className="flex items-center justify-between">
            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-4 w-64 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg p-8">
            <div className="h-10 w-32 bg-blue-200 bg-opacity-30 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="h-16 w-48 bg-blue-200 bg-opacity-30 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 w-full bg-blue-200 bg-opacity-30 rounded mb-4 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-6 w-24 bg-slate-200 rounded mb-2"></div>
                <div className="h-8 w-16 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-6 w-48 bg-slate-200 rounded mb-4"></div>
            <div className="h-64 w-full bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-6 animate-fadeIn px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{DASHBOARD_TEXTS.titulo}</h1>
      </div>

      {/* Process Steps */}
      <ProcessSteps 
        currentStep={getCurrentStep()}
        userPoints={userStats.totalPoints}
        userActivities={userStats.totalActivities}
      />



      {/* Level Requirements */}
      <LevelRequirements 
        userPoints={userStats.totalPoints}
        userActivities={userStats.totalActivities}
      />

      <ScoreCard
        title="Total de Pontos"
        value={userStats.totalPoints}
        icon={<svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>}
        color="yellow"
        maxValue={75} // Meta para nível VI (Doutorado)
        subtitle="pontos acumulados"
        userActivities={userStats.totalActivities}
        userCategories={uniqueCategories}
      />



      {userStats.totalActivities > 0 && (
        <CategoryDistribution
          data={Object.entries(userStats.activitiesByCategory).map(([category, value]) => ({
            category,
            categoryName: userStats.categoryNames[category] || category,
            value,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
          }))}
          title="Distribuição por Categoria"
        />
      )}

      <ActivityList />
    </div>
  );
};

export default DashboardPage;
