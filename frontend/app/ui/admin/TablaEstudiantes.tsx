import { Estudiantes } from "@/app/types/admin/types";
import TablaPaginada from "./TablaPaginada";

export default async function TablaEstudiantes({
    query = '',
    carrera = '',
    estado = ''
}: {
    query?: string;
    carrera?: string;
    estado?: string;
}) {
    const rawData = await fetch('http://api:8000/api/estudiantes/obtener-estudiantes', {
        cache: 'no-store'
    });
    let data: Estudiantes[] = await rawData.json();

    if (!Array.isArray(data)) {
        return <div className="text-red-500 p-4">Error al cargar datos.</div>;
    }

    if (query) {
        const lowerQuery = query.toLowerCase();
        data = data.filter((estudiante) =>
            String(estudiante.nombre).toLowerCase().includes(lowerQuery) || 
            String(estudiante.matricula).toLowerCase().includes(lowerQuery)
        );
    }

    if (carrera && carrera !== 'Todas las Carreras') {
        data = data.filter((estudiante) => estudiante.carrera === carrera);
    }

    if (estado && estado !== 'Cualquier Estado') {
        data = data.filter((estudiante) => estudiante.status === estado);
    }

    return (
        <TablaPaginada data={data}/>
    );
}