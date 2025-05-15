// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ActivityItem from '../components/Dashboard/ActivityItem';
import { getActivitiesList } from '../services/api';
import LoadingSpinner from "@/components/Common/LoadingSpinner";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getActivitiesList();
        setActivities(data);
      } catch (err) {
        setError('Erro ao carregar atividades');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) loadData();
  }, [currentUser]);

  if (loading) return <LoadingSpinner />;

  if (error) return (
    <div className="text-red-600 p-4 text-center">
      {error}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Meu Progresso - RSC-TAE
      </h1>
      
      <div className="space-y-6">
        {activities.map((activity) => (
          <ActivityItem 
            key={activity.id} 
            item={activity} 
          />
        ))}
      </div>
    </div>
  );
}