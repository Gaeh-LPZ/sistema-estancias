"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const links = [
    { href: '/admin', icon: 'dashboard', name: 'Dashboard' },
    { href: '/admin/estudiantes', icon: 'group', name: 'Estudiantes' },
    { href: '#', icon: 'fact_check', name: 'Validación' },
    { href: '#', icon: 'analytics', name: 'Reportes' },
    { href: '#', icon: 'description', name: 'Documentos' }
]

export default function NavBarAdmin() {
    const pathname = usePathname();

    return (
        <section className="hidden xl:flex flex-col p-6 w-1/6 h-screen gap-6 border-r border-gray-400">
            <header className="flex flex-row items-center gap-2">
                <div className="text-on-primary w-10 h-10 rounded-lg bg-[#1e3a8a] items-center justify-center text-center flex">
                    <span className="material-symbols-outlined text-white">domain</span>
                </div>
                <div>
                    <h1 className="text-[18px] font-bold">Panel de Gestión</h1>
                    <p className="text-sm">Administración</p>
                </div>
            </header>
            <nav className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-2.5">
                    {links.map((link) => (
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
        </section>
    );
}