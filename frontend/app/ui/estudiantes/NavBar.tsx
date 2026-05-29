"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export default function NavBarEstudiantes(){
    const main_links = [
        { href:'#', icon: 'assignment_ind', name: 'Datos de la estancia'},
        { href:'#', icon: 'description', name: 'Documentos'},
        { href:'/estudiantes/perfil', icon: 'account_circle', name: 'Mi perfil'}
    ]

    const pathname = usePathname();

    return(
        <aside className="hidden xl:flex flex-col p-6 w-1/6 h-screen gap-6 border-r border-gray-400">
            <div className="flex flex-col">
                <h1 className="text-[18px] font-bold">Panel de Gestión</h1>
                <p>Portal Estudiantil</p>
            </div>
            <nav className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-2.5">
                    {main_links.map((link) => (
                    <Link href={link.href} key={link.name} 
                    className={clsx(
                        'flex flex-row items-center gap-1.5 cursor-pointer p-2',
                        {
                            'bg-[#d0e1fb] text-gray-700 rounded-md hover:scale-105 transition-all transform': pathname === link.href,
                        },
                    )}>
                        <span className="material-symbols-outlined">{link.icon}</span>
                        {link.name}
                    </Link>
                    ))}
                </div>
                <div className="flex flex-col gap-2.5 border-t border-gray-400 pt-6">
                    <Link href="#" className="flex flex-row items-center gap-1.5">
                        <span className="material-symbols-outlined">help</span>
                        Ayuda
                    </Link>
                    <button className="flex flex-row items-center gap-1.5 w-fit text-red-800 cursor-pointer">
                        <span className="material-symbols-outlined">logout</span>
                        Cerrar Sesión
                    </button>
                </div>
            </nav>
        </aside>
    );
}