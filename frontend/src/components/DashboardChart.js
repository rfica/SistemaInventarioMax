import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

const DashboardChart = () => {
  const [chartData, setChartData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/movements', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Agrupar por tipo
        const tipos = ['entrada', 'salida', 'devolucion', 'ajuste', 'transferencia'];
        const counts = tipos.map(tipo =>
          res.data.filter(m => m.tipo === tipo).length
        );

        setChartData({
          labels: tipos,
          datasets: [{
            label: 'Movimientos por tipo',
            data: counts,
            backgroundColor: [
              'rgba(75, 192, 192, 0.5)',  // entrada - verde
              'rgba(255, 99, 132, 0.5)',   // salida - rojo
              'rgba(54, 162, 235, 0.5)',   // devolucion - azul
              'rgba(255, 206, 86, 0.5)',   // ajuste - amarillo
              'rgba(153, 102, 255, 0.5)'   // transferencia - morado
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
          }]
        });
      } catch (err) {
        console.error('Error al cargar datos del gráfico:', err);
      }
    };

    fetchData();
  }, []);

  if (!chartData) return <div>Cargando gráfico...</div>;

  return (
    <div style={{ maxHeight: '400px' }} className=''>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false
        }}
      />
    </div>
  );
};

export default DashboardChart;