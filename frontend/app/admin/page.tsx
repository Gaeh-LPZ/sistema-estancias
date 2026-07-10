export default function Page() {
    return (
        <div className="p-8 space-y-6 h-full overflow-y-auto">
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
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-gray-400 p-6 flex flex-col h-100">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h5 className="text-lg">Actividad de Validaciones</h5>
                            <p className="text-xs">Documentos procesados por semana</p>
                        </div>
                        <select className="bg-[#eceef0] border-none text-xs rounded-lg focus:ring-blue-950/20">
                            <option>Últimos 30 días</option>
                            <option>Semestre Actual</option>
                        </select>
                    </div>
                    <div className="grow flex items-end justify-between gap-3 pt-6">
                        <div className="flex flex-col items-center flex-1 h-full justify-end group">
                            <div className="w-full bg-[#1e3a8a]/20 rounded-t-4xl relative h-[40%] group-hover:bg-[#1e3a8a]/40 transition-colors">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#191c1e] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">120</div>
                            </div>
                            <span className="text-[10px] mt-2 text-[#444651]">Sem 1</span>
                        </div>
                        <div className="flex flex-col items-center flex-1 h-full justify-end group">
                            <div className="w-full bg-[#1e3a8a]/20 rounded-t-lg relative h-[65%] group-hover:bg-[#1e3a8a]/40 transition-colors">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#191c1e] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">184</div>
                            </div>
                            <span className="text-[10px] mt-2 text-[#444651]">Sem 2</span>
                        </div>
                        <div className="flex flex-col items-center flex-1 h-full justify-end group">
                            <div className="w-full bg-[#1e3a8a]/60 rounded-t-lg relative h-[85%] group-hover:bg-blue-900 transition-colors">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#191c1e] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">245</div>
                            </div>
                            <span className="text-[10px] mt-2 font-bold text-blue-900">Sem 3</span>
                        </div>
                        <div className="flex flex-col items-center flex-1 h-full justify-end group">
                            <div className="w-full bg-[#1e3a8a]/20 rounded-t-lg relative h-[55%] group-hover:bg-[#1e3a8a]/40 transition-colors">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#191c1e] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">160</div>
                            </div>
                            <span className="text-[10px] mt-2 text-[#444651]">Sem 4</span>
                        </div>
                        <div className="flex flex-col items-center flex-1 h-full justify-end group">
                            <div className="w-full bg-[#1e3a8a]/20 rounded-t-lg relative h-[70%] group-hover:bg-[#1e3a8a]/40 transition-colors">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#191c1e] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">198</div>
                            </div>
                            <span className="text-[10px] mt-2 text-[#444651]">Sem 5</span>
                        </div>
                        <div className="flex flex-col items-center flex-1 h-full justify-end group">
                            <div className="w-full bg-[#1e3a8a]/20 rounded-t-lg relative h-[45%] group-hover:bg-[#1e3a8a]/40 transition-colors">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#191c1e] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">135</div>
                            </div>
                            <span className="text-[10px] mt-2 text-[#444651]">Sem 6</span>
                        </div>
                    </div>
                </div>
                <div className="col-span-12 lg:col-span-4 bg-blue-900 text-white rounded-xl p-6 relative overflow-hidden h-100">
                    <div className="relative z-10 h-full flex flex-col">
                        <h5 className="text-lg mb-1 font-semibold">Acciones Prioritarias</h5>
                        <p className="text-sm opacity-80 mb-10">Hay documentos críticos que esperan su validación final.</p>
                        <div className="space-y-1 grow">
                            <div className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-lg flex items-center gap-3 cursor-pointer border border-white/5">
                                <span className="material-symbols-outlined" data-icon="priority_high">priority_high</span>
                                <div className="flex-1">
                                    <p className="text-xs font-bold">Convenio Pfizer Inc.</p>
                                    <p className="text-[10px] opacity-70">Pendiente de firma legal</p>
                                </div>
                                <span className="material-symbols-outlined text-[20px]" data-icon="chevron_right">chevron_right</span>
                            </div>
                            <div className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-lg flex items-center gap-3 cursor-pointer border border-white/5">
                                <span className="material-symbols-outlined" data-icon="description">description</span>
                                <div className="flex-1">
                                    <p className="text-xs font-bold">Reporte Final: 12 Estudiantes</p>
                                    <p className="text-[10px] opacity-70">Verificar horas totales</p>
                                </div>
                                <span className="material-symbols-outlined text-[20px]" data-icon="chevron_right">chevron_right</span>
                            </div>
                            <div className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-lg flex items-center gap-3 cursor-pointer border border-white/5">
                                <span className="material-symbols-outlined" data-icon="verified_user">verified_user</span>
                                <div className="flex-1">
                                    <p className="text-xs font-bold">Validación Masiva</p>
                                    <p className="text-[10px] opacity-70">Cartas de terminación (24)</p>
                                </div>
                                <span className="material-symbols-outlined text-[20px]" data-icon="chevron_right">chevron_right</span>
                            </div>
                        </div>
                        <button className="w-full bg-white text-blue-900 font-bold py-3 rounded-lg text-xs hover:bg-[#f7f9fb] transition-colors">
                            Ir al Panel de Validación
                        </button>
                    </div>
                    <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                </div>
                <div className="col-span-12 bg-white rounded-xl border border-gray-400 overflow-hidden">
                    <div className="p-6 border-b border-gray-400 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h5 className="text-lg">Gestión de Usuarios Administrativos</h5>
                            <p className="text-xs">Administra los permisos y roles de acceso al personal de estancias.</p>
                        </div>
                        <button className="bg-blue-900 text-white px-6 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:shadow-lg transition-all active:scale-95">
                            <span className="material-symbols-outlined" data-icon="person_add">person_add</span>
                            Agregar Administrador
                        </button>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f2f4f6] border-b border-gray-400">
                                    <th className="px-6 py-3 text-xs font-bold">Nombre</th>
                                    <th className="px-6 py-3 text-xs font-bold">Rol</th>
                                    <th className="px-6 py-3 text-xs font-bold">Correo Electrónico</th>
                                    <th className="px-6 py-3 text-xs font-bold">Estado</th>
                                    <th className="px-6 py-3 text-xs font-bold text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-400">
                                <tr className="hover:bg-[#f2f4f6] transition-colors group">
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#d0e1fb] text-blue-950 flex items-center justify-center font-bold text-xs uppercase">
                                                MC
                                            </div>
                                            <span className="text-sm font-medium">Mariana Cervantes</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="text-sm">Coordinador de Carrera</span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="text-sm">m.cervantes@universidad.edu</span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-700">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                                            Activo
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 hover:bg-[#e6e8ea] rounded" title="Editar">
                                                <span className="material-symbols-outlined text-[18px]" data-icon="edit">edit</span>
                                            </button>
                                            <button className="p-1.5 hover:bg-[#e6e8ea] rounded text-red-800" title="Eliminar">
                                                <span className="material-symbols-outlined text-[18px]" data-icon="delete">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="hover:bg-[#f2f4f6] transition-colors group">
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white text-[10px] overflow-hidden">
                                                <img className="w-full h-full object-cover" data-alt="Close up portrait of a young professional woman with dark hair tied back, wearing a white shirt. Soft studio lighting on a neutral grey background, clean minimalist aesthetics." src="https://lh3.googleusercontent.com/aida-public/AB6AXuARmlrm5xISvbujM2XRt5Q0idTYedaWwOYD67cn0ELBzvdObX0R8sMTOHrX9EFivzIEa4FoMdxZYv5n15s-kAuCksnm4Sv1kLgrsDAD00DR9lbQlFaGm3scMs-3zodSwKJx_2xWNr6HvptY8Inm09n23QsjxkkCM_yb3oBtrx1BbWArJsxSWdATxTGM4IaWaVuv8cB5piSchyYo_GupAJJaFNAjAK0IjqUb9r7uuu7z-H0VRD8OKL9dlw" />
                                            </div>
                                            <span className="text-sm font-medium">Lucía Méndez</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="text-sm">Validador de Documentos</span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="text-sm">l.mendez@universidad.edu</span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-700">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                                            Activo
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 hover:bg-[#e6e8ea] rounded" title="Editar">
                                                <span className="material-symbols-outlined text-[18px]" data-icon="edit">edit</span>
                                            </button>
                                            <button className="p-1.5 hover:bg-[#e6e8ea] rounded text-red-800" title="Eliminar">
                                                <span className="material-symbols-outlined text-[18px]" data-icon="delete">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="hover:bg-[#f2f4f6] transition-colors group">
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs uppercase">
                                                RG
                                            </div>
                                            <span className="text-sm font-medium">Roberto Gómez</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="text-sm">Analista de Reportes</span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="text-sm">r.gomez@universidad.edu</span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#e0e3e5]">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#757682] mr-1.5"></span>
                                            Inactivo
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 hover:bg-[#e6e8ea] rounded" title="Editar">
                                                <span className="material-symbols-outlined text-[18px]" data-icon="edit">edit</span>
                                            </button>
                                            <button className="p-1.5 hover:bg-[#e6e8ea] rounded text-red-800" title="Eliminar">
                                                <span className="material-symbols-outlined text-[18px]" data-icon="delete">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
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