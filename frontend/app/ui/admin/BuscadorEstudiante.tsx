'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function BuscadorEstudiantes() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        
        if (value && value !== 'Todas las Carreras' && value !== 'Cualquier Estado') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="p-3 md:p-6 border border-gray-300 flex flex-col md:flex-row justify-between items-center gap-3 bg-[#f7f9fb] rounded-t-md">
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-80">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
                    <input 
                        className="w-full border border-gray-400 rounded-lg py-2 pl-10 pr-3 text-[14px] focus:outline-none focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] transition-all" 
                        placeholder="Buscar por nombre o matrícula..." 
                        type="text" 
                        onChange={(e) => handleFilter('query', e.target.value)}
                        defaultValue={searchParams.get('query')?.toString()}
                    />
                </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                <select 
                    className="border border-gray-400 rounded-lg py-2 px-3 text-[14px] focus:outline-none focus:border-[#00236f]"
                    onChange={(e) => handleFilter('carrera', e.target.value)}
                    defaultValue={searchParams.get('carrera')?.toString() || 'Todas las Carreras'}
                >
                    <option>Todas las Carreras</option>
                    <option>Ingeniería en Software</option>
                    <option>Administración</option>
                    <option>Derecho</option>
                </select>
                <select 
                    className="border border-gray-400 rounded-lg py-2 px-3 text-[14px] focus:outline-none focus:border-[#00236f]"
                    onChange={(e) => handleFilter('estado', e.target.value)}
                    defaultValue={searchParams.get('estado')?.toString() || 'Cualquier Estado'}
                >
                    <option>Cualquier Estado</option>
                    <option>Validado</option>
                    <option>En Proceso</option>
                    <option>Pendiente</option>
                    <option>Sin Entregas</option>
                </select>
            </div>
        </div>
    );
}