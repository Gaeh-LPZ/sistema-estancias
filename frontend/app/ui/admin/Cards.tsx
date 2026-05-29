import clsx from "clsx";

export default function CardWrapper() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="Total Estudiantes Activos" value={"1,248"} icon="groups"/>
            <Card title="Pendientes de validación" value={42} icon="warning"/>
            <Card title="Convenios Completados" value={'89%'} icon="task_alt"/>
        </div>
    );
}

export function Card({title, value, icon} : {title: string, value: number | string, icon: string}){
    return (
        <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm flex flex-col gap-1">
            <span className="font-medium text-xs uppercase tracking-wider">{title}</span>
            <div className="flex items-center justify-between">
                <span className={clsx(
                    'font-bold text-xl',
                    {
                        'text-red-600' : title === 'Pendientes de validación'
                    },
                )}>
                    {value}
                </span>
                <span className={clsx(
                    'material-symbols-outlined text-[#00236f] text-[32px]',
                    {
                        'text-red-600' : title === 'Pendientes de validación'
                    },
                )}>
                    {icon}
                </span>
            </div>
        </div>
    );
}