import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getActivitiesList } from '../services/api';
import ActivityItem from '../components/Dashboard/ActivityItem';
import LoadingSpinner from '../components/Common/LoadingSpinner';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        if (!currentUser?.uid) return;a// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getActivitiesList } from '../services/api';
import ActivityItem from '../components/Dashboard/ActivityItem';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadActivities = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getActivitiesList(currentUser?.uid);
      setActivities(data);
    } catch (err) {
      console.error('Erro ao carregar atividades:', err);
      setError(err.message || 'Erro ao carregar atividades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.uid) {
      loadActivities();
    }
  }, [currentUser]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Meu Progresso - RSC-TAE
      </h1>
      
      {error && (
        <ErrorMessage 
          message={error}
          onRetry={loadActivities}
        />
      )}

      <div className="space-y-6">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <ActivityItem 
              key={activity.id} 
              item={activity} 
            />
          ))
        ) : (
          !error && (
            <div className="text-center py-10">
              <p className="text-gray-500">Nenhuma atividade encontrada</p>
              <button
                onClick={loadActivities}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Recarregar
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
        
        setLoading(true);
        const data = await getActivitiesList(currentUser.uid);
        setActivities(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Erro ao carregar atividades');
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [currentUser]);

  if (loading) return <LoadingSpinner />;

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Meu Progresso - RSC-TAE
      </h1>
      
      {activities.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Nenhuma atividade encontrada</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activities.map((activity) => (
            <ActivityItem 
              key={activity.id} 
              item={activity} 
            />
          ))}
        </div>
      )}
    </div>
  );
}