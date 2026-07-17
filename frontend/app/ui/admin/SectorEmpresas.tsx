"use client";
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { API_BASE_URL } from '@/app/lib/config';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6'];

export default function SectorEmpresas() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/estadisticas/sectores`)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("Error al cargar sectores:", err));
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full h-96">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Distribución por Sector Receptivo</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}