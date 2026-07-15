"use client";
import { useState, useEffect } from 'react';
import ModalAgregarAdmin from '@/app/ui/admin/ModalAgregarAdmin';
import ProgresoTramites from '@/app/ui/admin/ProgresoTramites';
import SectorEmpresas from '@/app/ui/admin/SectorEmpresas';
import DemografiaAlumnos from '@/app/ui/admin/DemografiaAlumnos';

export default function Page() {
    const [admins, setAdmins] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Función para obtener los administradores desde la API
    const fetchAdmins = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/administradores`);
            if (res.ok) {
                const data = await res.json();
                setAdmins(data);
            }
        } catch (error) {
            console.error("Error al cargar administradores:", error);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);


    // Función para refrescar la tabla después de agregar
    const handleAdminAdded = () => {
        window.location.reload(); // La forma más simple de refrescar los datos
    };
    return (
        <div className="flex-1 w-full p-8 space-y-6 h-full overflow-y-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-2xl text-blue-950">Vista General del Sistema</h3>
                    <p className="text-[16px]">Bienvenido de nuevo. Aquí tienes un resumen de la actividad académica actual.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-[#e6e8ea] rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-[#e0e3e5] transition-colors">
                        <span className="material-symbols-outlined text-lg" data-icon="calendar_today">calendar_today</span>
                        Ciclo Escolar 2024-1
                    </button>
                    <button className="px-4 py-2 bg-blue-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 hover:opacity-90 transition-opacity">
                        <span className="material-symbols-outlined text-lg" data-icon="download">download</span>
                        Exportar Reporte
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="metric-card bg-white p-6 rounded-xl border border-gray-400 flex items-center gap-6">
                    <div className="w-14 h-14 bg-[#d0e1fb] rounded-full flex items-center justify-center text-blue-900">
                        <span className="material-symbols-outlined text-[32px]" data-icon="person">person</span>
                    </div>
                    <div>
                        <p className="text-xs">Total de Estudiantes</p>
                        <h4 className="text-2xl font-bold text-blue-900">1,248</h4>
                        <p className="text-[10px] text-green-600 font-bold flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-[14px]" data-icon="arrow_upward">arrow_upward</span>
                            +12% este mes
                        </p>
                    </div>
                </div>
                <div className="metric-card bg-white p-6 rounded-xl border border-gray-400 flex items-center gap-6">
                    <div className="w-14 h-14 bg-[#ffdbcb] rounded-full flex items-center justify-center text-[#4b1c00]">
                        <span className="material-symbols-outlined text-[32px]" data-icon="pending_actions">pending_actions</span>
                    </div>
                    <div>
                        <p className="text-xs">Solicitudes Pendientes</p>
                        <h4 className="text-2xl font-bold text-blue-900">42</h4>
                        <p className="text-[10px] text-[#4b1c00] font-bold flex items-center gap-1 mt-1">
                            Requiere atención inmediata
                        </p>
                    </div>
                </div>
                <div className="metric-card bg-white p-6 rounded-xl border border-gray-400 flex items-center gap-6">
                    <div className="w-14 h-14 bg-[#dce1ff] rounded-full flex items-center justify-center text-blue-900">
                        <span className="material-symbols-outlined text-[32px]" data-icon="handshake">handshake</span>
                    </div>
                    <div>
                        <p className="text-xs">Convenios Activos</p>
                        <h4 className="text-2xl font-bold text-blue-900">186</h4>
                        <p className="text-[10px] font-medium mt-1">
                            8 nuevos convenios este semestre
                        </p>
                    </div>
                </div>
                <div className="metric-card bg-white p-6 rounded-xl border border-gray-400 flex items-center gap-6">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                        <span className="material-symbols-outlined text-[32px]" data-icon="task_alt">task_alt</span>
                    </div>
                    <div>
                        <p className="text-xs">Reportes Completados</p>
                        <h4 className="text-2xl font-bold text-blue-900">95%</h4>
                        <p className="text-[10px] text-green-600 font-bold flex items-center gap-1 mt-1">
                            Eficiencia máxima
                        </p>
                    </div>
                </div>
            </div>

            {/* Nueva sección de gráficas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProgresoTramites />
                <SectorEmpresas />
                <div className="col-span-1 lg:col-span-2">
                    <DemografiaAlumnos />
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 bg-white rounded-xl border border-gray-400 overflow-hidden">
                    <div className="p-6 border-b border-gray-400 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h5 className="text-lg">Gestión de Usuarios Administrativos</h5>
                            <p className="text-xs">Administra los permisos y roles de acceso al personal de estancias.</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-900 text-white px-6 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:shadow-lg transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined" data-icon="person_add">person_add</span>
                            Agregar Administrador
                        </button>

                        {/* Renderizado del Modal */}
                        <ModalAgregarAdmin
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onAdminAdded={handleAdminAdded}
                        />
                    </div>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f2f4f6] border-b border-gray-400">
                                    <th className="px-6 py-3 text-xs font-bold">Nombre</th>
                                    <th className="px-6 py-3 text-xs font-bold">Rol ID</th>
                                    <th className="px-6 py-3 text-xs font-bold">Correo Electrónico</th>
                                    <th className="px-6 py-3 text-xs font-bold">Estado</th>
                                    <th className="px-6 py-3 text-xs font-bold text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-400">
                                {admins.map((admin: any) => (
                                    <tr key={admin.id} className="hover:bg-[#f2f4f6] transition-colors group">
                                        <td className="px-6 py-3 text-sm font-medium">{admin.nombre}</td>
                                        <td className="px-6 py-3 text-sm">{admin.rol_id}</td>
                                        <td className="px-6 py-3 text-sm">{admin.correo}</td>
                                        <td className="px-6 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${admin.estado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${admin.estado ? 'bg-green-500' : 'bg-red-500'} mr-1.5`}></span>
                                                {admin.estado ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1.5 hover:bg-[#e6e8ea] rounded"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                                                <button className="p-1.5 hover:bg-[#e6e8ea] rounded text-red-800"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-3 bg-[#f2f4f6] border-t border-gray-400 flex justify-center">
                        <button className="text-xs font-bold text-blue-900 hover:underline transition-all">Ver todos los administradores</button>
                    </div>
                </div>
            </div>
        </div>
    );
}