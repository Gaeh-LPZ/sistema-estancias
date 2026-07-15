"use client";
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProgresoTramites() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Apuntamos a la API de tu backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/estadisticas/progreso`)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("Error al cargar progreso:", err));
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full h-96">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Progreso del Trámite de Estancias</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="etapa" type="category" width={140} />
          <Tooltip cursor={{ fill: 'transparent' }} />
          <Bar dataKey="alumnos" fill="#4F46E5" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}