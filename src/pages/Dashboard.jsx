// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ActivityItem from '../components/Dashboard/ActivityItem';
import { getActivitiesList } from '../services/api';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const loadActivities = async () => {
      const list = await getActivitiesList();
      setActivities(list);
    };
    loadActivities();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Meu Progresso RSC-TAE</h1>
      
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Pontuação Total: [Total]</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-3 bg-white rounded shadow">
            <h3 className="font-medium">Nível Atual</h3>
            <p className="text-2xl">RSC-TAE III</p>
          </div>
          <div className="p-3 bg-white rounded shadow">
            <h3 className="font-medium">Progresso</h3>
            <p className="text-2xl">65%</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} item={activity} />
        ))}
      </div>
    </div>
  );
}