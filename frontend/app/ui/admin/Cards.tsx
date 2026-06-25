import clsx from "clsx";
import { Estudiantes } from "@/app/types/admin/types";

export default async function CardWrapper() {
    const rawData = await fetch('http://api:8000/api/estudiantes/obtener-estudiantes', {
        cache: 'no-store'
    });
    const data: Estudiantes[] = await rawData.json();

    const estudiantes = Array.isArray(data) ? data : [];

    const totalEstudiantes = estudiantes.length;

    const pendientes = estudiantes.filter(
        (est) => est.status === 'PENDIENTE' || est.status === 'Pendiente'
    ).length;

    // Convenios Completados (%):
    // Supongamos que cuentas como "Completado" a los que tienen status "Finalizado", "Liberado" o "Completado"
    const completados = estudiantes.filter(
        (est) => est.status === 'COMPLETADO' || est.status === 'Liberado' || est.status === 'Finalizado'
    ).length;
    
    // Calculamos el porcentaje evitando dividir entre cero
    const porcentajeCompletados = totalEstudiantes > 0 
        ? Math.round((completados / totalEstudiantes) * 100) 
        : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card 
                title="Total Estudiantes Activos" 
                value={totalEstudiantes.toLocaleString()} 
                icon="groups"
            />
            <Card 
                title="Pendientes de validación" 
                value={pendientes} 
                icon="warning"
            />
            <Card 
                title="Convenios Completados" 
                value={`${porcentajeCompletados}%`} 
                icon="task_alt"
            />
        </div>
    );
}

export function Card({title, value, icon} : {title: string, value: number | string, icon: string}){
    return (
        <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm flex flex-col gap-1">
            <span className="font-medium text-xs uppercase tracking-wider text-gray-600">{title}</span>
            <div className="flex items-center justify-between">
                <span className={clsx(
                    'font-bold text-xl',
                    {
                        'text-red-600' : title === 'Pendientes de validación' && Number(value) > 0,
                        'text-green-600' : title === 'Convenios Completados' && value === '100%',
                        'text-gray-900' : title !== 'Pendientes de validación' && title !== 'Convenios Completados' || (title === 'Pendientes de validación' && Number(value) === 0)
                    },
                )}>
                    {value}
                </span>
                <span className={clsx(
                    'material-symbols-outlined text-[32px]',
                    {
                        'text-red-600' : title === 'Pendientes de validación' && Number(value) > 0,
                        'text-green-600' : title === 'Convenios Completados' && value === '100%',
                        'text-[#00236f]' : (title !== 'Pendientes de validación' && title !== 'Convenios Completados') || (title === 'Pendientes de validación' && Number(value) === 0) || (title === 'Convenios Completados' && value !== '100%')
                    },
                )}>
                    {icon}
                </span>
            </div>
        </div>
    );
}