interface DetallesProps {
    datos: {
        estudiante: {
            nombre_completo: string;
            matricula: string;
            carrera: string;
            semestre: string;
            correo: string;
            telefono: string;
        };
        empresa: {
            nombre: string;
            sector: string;
            ubicacion: string;
            tutor_nombre: string;
            tutor_cargo: string;
            tutor_correo: string;
            telefono: string;
        };
        estancia: {
            tipo: string;
            proyecto: string;
            objetivo: string;
            actividades: string;
            fecha_inicio: string | null;
            fecha_fin: string | null;
            total_horas: string;
            horario: string;
        };
    } | null;
}

export default function Detalles({ datos }: DetallesProps) {
    // Si no hay datos (porque apenas se va a llenar o falló el fetch), mostramos un fallback amigable
    if (!datos) {
        return (
            <div className="bg-white rounded-xl border border-[#c5c5d3] p-6 text-center">
                <p className="text-gray-500">No se ha encontrado información registrada aún.</p>
            </div>
        );
    }

    const { estudiante, empresa, estancia } = datos;

    // Función auxiliar para mostrar "15 Ago - 15 Dic, 2024" o similar
    const formatearFecha = (fechaStr: string | null) => {
        if (!fechaStr) return "";
        const fecha = new Date(fechaStr + "T00:00:00");
        return fecha.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const rangoFechas = estancia.fecha_inicio && estancia.fecha_fin
        ? `${formatearFecha(estancia.fecha_inicio)} al ${formatearFecha(estancia.fecha_fin)}`
        : "Sin definir";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6  overflow-y-auto">
            {/* Tarjeta 1: Estudiante */}
            <div className="bg-white rounded-xl border border-[#c5c5d3] shadow-sm p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6 border-b border-[#c5c5d3] pb-3">
                    <span className="material-symbols-outlined text-[#1e3a8a] text-[24px]" data-icon="person">person</span>
                    <h3 className="text-lg font-medium">Información del Estudiante</h3>
                </div>
                <div className="flex flex-col gap-1 mb-6">
                    <p className="font-semibold text-lg">{estudiante.nombre_completo || "Sin registrar"}</p>
                    <p className="font-medium text-xs text-gray-600 bg-[#eceef0] px-2 py-1 rounded inline-block mt-1">
                        Matrícula: {estudiante.matricula || "Sin registrar"}
                    </p>
                </div>
                <div className="space-y-3 flex-1">
                    <div>
                        <p className="text-xs mb-1">Carrera</p>
                        <p className="text-sm font-medium">{estudiante.carrera || "Sin registrar"}</p>
                    </div>
                    <div>
                        <p className="text-xs mb-1">Semestre Actual</p>
                        <p className="text-sm font-medium">{estudiante.semestre || "Sin registrar"}</p>
                    </div>
                    <div>
                        <p className="text-xs mb-1">Correo Electrónico</p>
                        <p className="text-sm font-medium truncate" title={estudiante.correo}>{estudiante.correo || "Sin registrar"}</p>
                    </div>
                    <div>
                        <p className="text-xs mb-1">Teléfono</p>
                        <p className="text-sm font-medium">{estudiante.telefono}</p>
                    </div>
                </div>
            </div>

            {/* Tarjeta 2: Empresa */}
            <div className="bg-white rounded-xl border border-[#c5c5d3] shadow-sm p-6 flex flex-col h-full lg:col-span-2">
                <div className="flex items-center gap-3 mb-6 border-b border-[#c5c5d3] pb-3">
                    <span className="material-symbols-outlined text-[#1e3a8a] text-[24px]" data-icon="domain">domain</span>
                    <h3 className="font-medium text-lg">Información de la Entidad</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md flex-1">
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs mb-1">Razón Social</p>
                            <p className="text-[16px] text-on-surface font-semibold text-primary">{empresa.nombre}</p>
                        </div>
                        <div>
                            <p className="text-xs mb-1">Sector Industrial</p>
                            <span className="text-xs text-[#00236f] bg-[#dce1ff] px-2 py-1 rounded-full font-medium inline-block">
                                {empresa.sector}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs mb-1">Ubicación</p>
                            <div className="flex items-start gap-1">
                                <span className="material-symbols-outlined text-[18px] text-[#444651] mt-0.5" data-icon="location_on">location_on</span>
                                <p className="text-sm font-medium">{empresa.ubicacion}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#f7f9fb] rounded-lg p-3 border border-[#e0e3e5]">
                        <h4 className="text-sm mb-3 uppercase tracking-wider">Contacto en la Entidad</h4>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs mb-1">Nombre del Tutor/Supervisor</p>
                                <p className="font-body-md text-body-md text-on-surface font-medium">{empresa.tutor_nombre}</p>
                            </div>
                            <div>
                                <p className="text-xs mb-1">Cargo/Departamento</p>
                                <p className="text-[16px] font-medium">{empresa.tutor_cargo}</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <p className="text-xs mb-1">Email</p>
                                    <p className="text-sm font-medium truncate" title={empresa.tutor_correo}>{empresa.tutor_correo}</p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs mb-1">Teléfono</p>
                                    <p className="text-sm font-medium">{empresa.telefono}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tarjeta 3: Estancia */}
            <div className="bg-white rounded-xl border border-[#c5c5d3] shadow-sm p-6 flex flex-col h-full lg:col-span-3">
                <div className="flex items-center justify-between mb-6 border-b border-[#c5c5d3] pb-3">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#1e3a8a] text-[24px]" data-icon="assignment">assignment</span>
                        <h3 className="text-lg">Detalles en la entidad</h3>
                    </div>
                    <span className="text-xs text-[#6e2c00] bg-[#ffdbcb] px-3 py-1 rounded-full font-bold uppercase">
                        Tipo: {estancia.tipo}
                    </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-3">
                        <div>
                            <p className="text-xs mb-1">Nombre del Proyecto</p>
                            <p className="text-[16px] font-semibold">{estancia.proyecto}</p>
                        </div>
                        <div>
                            <p className="text-xs mb-1">Objetivo Principal</p>
                            <p className="text-sm bg-[#f7f9fb] p-3 rounded-lg border border-[#e0e3e5]">{estancia.objetivo}</p>
                        </div>
                        <div>
                            <p className="text-xs mb-1">Actividades Clave (Entregables)</p>
                            <p className="text-sm bg-[#f7f9fb] p-3 rounded-lg border border-[#e0e3e5] whitespace-pre-line">
                                {estancia.actividades}
                            </p>
                        </div>
                    </div>
                    <div className="bg-[#f2f4f6] rounded-xl p-6 border border-[#e0e3e5] flex flex-col justify-center space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-full bg-[#d3e4fe] flex items-center justify-center text-[#0b1c30]">
                                <span className="material-symbols-outlined" data-icon="calendar_month">calendar_month</span>
                            </div>
                            <div>
                                <p className="text-xs">Fecha de Realización</p>
                                <p className="text-lg font-semibold">{rangoFechas}</p>
                            </div>
                        </div>
                        <hr className="border-[#c5c5d3]" />
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-full bg-[#dce1ff] flex items-center justify-center text-[#00164e]">
                                <span className="material-symbols-outlined" data-icon="schedule">schedule</span>
                            </div>
                            <div>
                                <p className="text-xs ">Total de Horas</p>
                                <p className="text-3xl text-[#00236f] font-bold">{estancia.total_horas}<span className="text-lg font-normal ml-1">hrs</span></p>
                            </div>
                        </div>
                        <hr className="border-[#c5c5d3]" />
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-full bg-[#e0e3e5] flex items-center justify-center text-[#191c1e]">
                                <span className="material-symbols-outlined" data-icon="work">work</span>
                            </div>
                            <div>
                                <p className="text-xs">Modalidad / Horario</p>
                                <p className="text-lg font-semibold">{estancia.horario}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}