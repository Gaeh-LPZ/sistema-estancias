export default function Detalles(){
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6  overflow-y-auto">
            <div className="bg-white rounded-xl border border-[#c5c5d3] shadow-sm p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6 border-b border-[#c5c5d3] pb-3">
                    <span className="material-symbols-outlined text-[#1e3a8a] text-[24px]" data-icon="person">person</span>
                    <h3 className="text-lg font-medium">Información del Estudiante</h3>
                </div>
                <div className="flex flex-col gap-1 mb-6">
                    <p className="font-semibold text-lg">Carlos Mendoza Ruiz</p>
                    <p className="font-medium text-xs text-gray-600 bg-[#eceef0] px-2 py-1 rounded inline-block mt-1">Matrícula: A01234567</p>
                </div>
                <div className="space-y-3 flex-1">
                    <div>
                        <p className="text-xs mb-1">Carrera</p>
                        <p className="text-sm font-medium">Ingeniería en Sistemas Computacionales</p>
                    </div>
                    <div>
                        <p className="text-xs mb-1">Semestre Actual</p>
                        <p className="text-sm font-medium">8vo Semestre</p>
                    </div>
                    <div>
                        <p className="text-xs mb-1">Correo Electrónico</p>
                        <p className="text-sm font-medium">carlos.mendoza@estudiantes.edu.mx</p>
                    </div>
                    <div>
                        <p className="text-xs mb-1">Teléfono</p>
                        <p className="text-sm font-medium">+52 (55) 1234 5678</p>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl border border-[#c5c5d3] shadow-sm p-6 flex flex-col h-full lg:col-span-2">
                <div className="flex items-center gap-3 mb-6 border-b border-[#c5c5d3] pb-3">
                    <span className="material-symbols-outlined text-[#1e3a8a] text-[24px]" data-icon="domain">domain</span>
                    <h3 className="font-medium text-lg">Información de la Empresa</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md flex-1">
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs mb-1">Razón Social</p>
                            <p className="text-[16px] text-on-surface font-semibold text-primary">TechNova Solutions S.A. de C.V.</p>
                        </div>
                        <div>
                            <p className="text-xs mb-1">Sector Industrial</p>
                            <span className="text-xs text-[#00236f] bg-[#dce1ff] px-2 py-1 rounded-full font-medium inline-block">Tecnología de la Información</span>
                        </div>
                        <div>
                            <p className="text-xs mb-1">Ubicación</p>
                            <div className="flex items-start gap-1">
                                <span className="material-symbols-outlined text-[18px] text-[#444651] mt-0.5" data-icon="location_on">location_on</span>
                                <p className="text-sm font-medium">Av. Innovación 404, Piso 8, Parque Industrial Tecnológico, Monterrey, N.L. 64000</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#f7f9fb] rounded-lg p-3 border border-[#e0e3e5]">
                        <h4 className="text-sm mb-3 uppercase tracking-wider">Contacto en la Empresa</h4>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs mb-1">Nombre del Tutor/Supervisor</p>
                                <p className="font-body-md text-body-md text-on-surface font-medium">Ing. Roberto Gómez Bolaños</p>
                            </div>
                            <div>
                                <p className="text-xs mb-1">Cargo/Departamento</p>
                                <p className="text-[16px] font-medium">Director de Arquitectura Cloud</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <p className="text-xs mb-1">Email</p>
                                    <p className="text-sm font-medium truncate" title="rgomez@technova.com.mx">rgomez@technova.com.mx</p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs mb-1">Teléfono</p>
                                    <p className="text-sm font-medium">Ext. 402</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl border border-[#c5c5d3] shadow-sm p-6 flex flex-col h-full lg:col-span-3">
                <div className="flex items-center justify-between mb-6 border-b border-[#c5c5d3] pb-3">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#1e3a8a] text-[24px]" data-icon="assignment">assignment</span>
                        <h3 className="text-lg">Detalles del Proyecto</h3>
                    </div>
                    <span className="text-xs text-[#6e2c00] bg-[#ffdbcb] px-3 py-1 rounded-full font-bold">Tipo: Estancia Profesional I</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-3">
                        <div>
                            <p className="text-xs mb-1">Nombre del Proyecto</p>
                            <p className="text-[16px] font-semibold">Migración de Infraestructura Monolítica a Microservicios en AWS</p>
                        </div>
                        <div>
                            <p className="text-xs mb-1">Objetivo Principal</p>
                            <p className="text-sm bg-[#f7f9fb] p-3 rounded-lg border border-[#e0e3e5]">Diseñar, implementar y documentar la migración de un módulo core de facturación hacia una arquitectura basada en contenedores utilizando EKS, mejorando la escalabilidad en un 40% durante picos de demanda.</p>
                        </div>
                        <div>
                            <p className="text-xs mb-1">Actividades Clave (Entregables)</p>
                            <ul className="list-disc list-inside text-sm space-y-1 ml-3">
                                <li>Análisis de dependencias del sistema actual.</li>
                                <li>Creación de Dockerfiles y pipelines de CI/CD.</li>
                                <li>Pruebas de carga y estrés en entorno de staging.</li>
                                <li>Manual de operación para equipo de soporte.</li>
                            </ul>
                        </div>
                    </div>
                    <div className="bg-[#f2f4f6] rounded-xl p-6 border border-[#e0e3e5] flex flex-col justify-center space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-full bg-[#d3e4fe] flex items-center justify-center text-[#0b1c30]">
                                <span className="material-symbols-outlined" data-icon="calendar_month">calendar_month</span>
                            </div>
                            <div>
                                <p className="text-xs">Periodo de Realización</p>
                                <p className="text-lg font-semibold">15 Ago - 15 Dic, 2024</p>
                            </div>
                        </div>
                        <hr className="border-[#c5c5d3]" />
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-full bg-[#dce1ff] flex items-center justify-center text-[#00164e]">
                                <span className="material-symbols-outlined" data-icon="schedule">schedule</span>
                            </div>
                            <div>
                                <p className="text-xs ">Total de Horas</p>
                                <p className="text-3xl text-[#00236f] font-bold">480<span className="text-lg font-normal ml-1">hrs</span></p>
                            </div>
                        </div>
                        <hr className="border-[#c5c5d3]" />
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-full bg-[#e0e3e5] flex items-center justify-center text-[#191c1e]">
                                <span className="material-symbols-outlined" data-icon="work">work</span>
                            </div>
                            <div>
                                <p className="text-xs">Modalidad</p>
                                <p className="text-lg font-semibold">Híbrida (3 días presencial)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}