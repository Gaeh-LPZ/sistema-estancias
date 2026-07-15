"use client";
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DemografiaAlumnos() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/estadisticas/demografia`)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("Error al cargar demografía:", err));
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full h-96">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Participación por Carrera y Género</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="carrera" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Mujeres" stackId="a" fill="#EC4899" />
          <Bar dataKey="Hombres" stackId="a" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}