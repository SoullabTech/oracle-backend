import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getPersonalityWeights } from '../services/monitoringService';
import { getAggregatedWisdom } from '../services/memoryService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function OracleDashboard() {
  const { data: weights, isLoading: weightsLoading } = useQuery({
    queryKey: ['personalityWeights'],
    queryFn: getPersonalityWeights,
  });

  const { data: wisdom, isLoading: wisdomLoading } = useQuery({
    queryKey: ['aggregatedWisdom'],
    queryFn: () => getAggregatedWisdom(['fire', 'water', 'earth', 'air', 'aether'], ['all']),
  });

  if (weightsLoading || wisdomLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const chartData = {
    labels: ['Fire', 'Water', 'Earth', 'Air', 'Aether'],
    datasets: [
      {
        label: 'Element Weights',
        data: weights?.map(w => w.weight * 100) || [],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
      {
        label: 'Confidence',
        data: weights?.map(w => w.confidence * 100) || [],
        borderColor: 'rgb(52, 211, 153)',
        backgroundColor: 'rgba(52, 211, 153, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Elemental Balance',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Oracle Insights</h2>
        <div className="h-80">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Collective Wisdom</h2>
        <div className="space-y-4">
          {wisdom?.map(item => (
            <div
              key={item.id}
              className="border-l-4 border-indigo-500 pl-4 py-2"
            >
              <p className="text-gray-700">{item.content}</p>
              <div className="mt-2 flex gap-2">
                {item.elements.map(element => (
                  <span
                    key={element}
                    className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                  >
                    {element}
                  </span>
                ))}
                {item.facets.map(facet => (
                  <span
                    key={facet}
                    className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {facet}
                  </span>
                ))}
              </div>
              <div className="mt-1 text-sm text-gray-500">
                Confidence: {Math.round(item.confidence * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}