export default function Page() {
    const input_style = 'h-10 px-3 rounded-lg border border-gray-400 bg-[#f7f9fb] focus:border-[#1e3a8a] outline-none';
    return (
        <div className="h-full overflow-y-auto flex-1 p-4 md:p-margin-8 bg-[#f2f4f6]">
            <div className="max-w-4xl mx-auto">
                <div className="mb-10">
                    <h2 className="mb-1">
                        Registro Inicial de Estancia
                    </h2>
                    <p>
                        Complete la información requerida para iniciar su proceso de vinculación profesional.
                    </p>
                </div>

                <div className="rounded-xl shadow-sm border border-gray-300 p-6 mb-6 flex items-center justify-between">
                    <div className="flex flex-col items-center step-active w-24">
                        <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center step-icon mb-2">
                            <span className="font-semibold text-lg">1</span>
                        </div>
                        <span className="font-medium text-lg text-center text-[#1e3a8a]">
                            Datos Personales
                        </span>
                    </div>

                    <div className="step-line active" />

                    <div className="flex flex-col items-center step-inactive w-24">
                        <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center step-icon mb-2">
                            <span className="font-semibold text-lg">2</span>
                        </div>
                        <span className="font-medium text-lg text-center">Empresa</span>
                    </div>

                    <div className="step-line" />

                    <div className="flex flex-col items-center step-inactive w-24">
                        <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center step-icon mb-2">
                            <span className="font-semibold text-lg">3</span>
                        </div>
                        <span className="font-medium text-lg text-center">Detalles</span>
                    </div>
                </div>

                <div className="rounded-xl shadow-sm border border-gray-300 overflow-hidden">
                    <div className="p-6 md:p-6 border-b border-gray-300">
                        <h3 className="font-semibold mb-1">
                            1. Información del Estudiante
                        </h3>
                        <p className="font-[14px]">
                            Verifique y complete sus datos académicos actuales.
                        </p>
                    </div>

                    <form className="h-full p-6 md:p-6 flex flex-col gap-6">
                        <div>
                            <h4 className="font-semibold mb-6 pb-1 border-b border-gray-300">
                                Datos Personales
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">Nombre(s)</label>
                                    <input
                                        className={input_style}
                                        placeholder="Ej. Juan"
                                        type="text"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">Apellidos</label>
                                    <input
                                        className={input_style}
                                        placeholder="Ej. Pérez García"
                                        type="text"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">Fecha de Nacimiento</label>
                                    <input
                                        className={input_style}
                                        type="date"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">Lugar de Nacimiento</label>
                                    <input
                                        className={input_style}
                                        type="text"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">Número de Seguro Social</label>
                                    <input
                                        className={input_style}
                                        type="text"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">Matrícula UMAR</label>
                                    <input
                                        className={input_style}
                                        type="text"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">Grupo</label>
                                    <input
                                        className={input_style}
                                        placeholder="Ej. 604"
                                        type="text"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">Porcentaje de créditos</label>
                                    <input
                                        className={input_style}
                                        placeholder="Ej. 85%"
                                        type="text"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Contacto */}
                        <div className="mt-6">
                            <h4 className="font-semibold mb-6 pb-1 border-b border-gray-300">Contacto</h4>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">Correo electrónico alternativo</label>
                                    <input
                                        className={input_style}
                                        type="email"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">Número de teléfono personal</label>
                                    <input
                                        className={input_style}
                                        type="tel"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">Número de teléfono alternativo</label>
                                    <input
                                        className={input_style}
                                        type="tel"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Domicilios */}
                        <div className="mt-6">
                            <h4 className="font-semibold mb-6 pb-1 border-b border-gray-400">Domicilio Local</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="flex flex-col gap-1 lg:col-span-2">
                                    <label className="font-semibold">Calle y número</label>
                                    <input
                                        className={input_style  }
                                        type="text"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">Colonia</label>
                                    <input
                                        className={input_style}
                                        type="text"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">Ciudad</label>
                                    <input
                                        className={input_style}
                                        type="text"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">Municipio</label>
                                    <input
                                        className={input_style}
                                        type="text"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">Código Postal</label>
                                    <input
                                        className={input_style}
                                        type="text"
                                    />
                                </div>
                            </div>

                            <h4 className="font-semibold mb-6 pb-1 border-b border-gray-400 mt-6">
                                Domicilio de Procedencia
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="flex flex-col gap-1 lg:col-span-2">
                                    <label className="font-semibold">Calle y número</label>
                                    <input
                                        className={input_style}
                                        type="text"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">Colonia</label>
                                    <input
                                        className={input_style}
                                        type="text"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">Ciudad</label>
                                    <input
                                        className={input_style}
                                        type="text"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">C.P.</label>
                                    <input
                                        className={input_style}
                                        type="text"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">Municipio</label>
                                    <input
                                        className={input_style}
                                        type="text"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">Estado</label>
                                    <input
                                        className={input_style}
                                        type="text"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Sociodemográfica */}
                        <div className="mt-6">
                            <h4 className="font-semibold mb-6 pb-1 border-b border-gray-400 mt-6">
                                Información Sociodemográfica
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">¿Tienes alguna discapacidad?</label>
                                    <select className={input_style}>
                                        <option value="no">No</option>
                                        <option value="si">Sí</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">¿Eres hablante de lengua indígena?</label>
                                    <select className={input_style}>
                                        <option value="no">No</option>
                                        <option value="si">Sí</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">¿Tienes hijos?</label>
                                    <select className={input_style}>
                                        <option value="no">No</option>
                                        <option value="si">Sí</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 5: Detalles de la Estancia */}
                        <div className="mt-6">
                            <h4 className="font-semibold mb-6 pb-1 border-b border-gray-400">
                                Detalles de la Estancia
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">Período</label>
                                    <select className={input_style}>
                                        <option value="primero">Primer periodo</option>
                                        <option value="segundo">Segundo periodo</option>
                                        <option value="unico">Periodo único</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">Tipo de Estancia</label>
                                    <select className={input_style}>
                                        <option value="verano">Verano</option>
                                        <option value="dual">Dual</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold">Mínimo de horas</label>
                                    <select className={input_style}>
                                        <option value="280">280 horas</option>
                                        <option value="560">560 horas</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#d0e1fb]/30 border border-[#d0e1fb] rounded-lg p-3 flex items-start gap-3 mt-6">
                            <span className="material-symbols-outlined mt-0.5">info</span>
                            <p className="font-medium">
                                Asegúrese de que todos sus datos sean correctos, ya que estos se imprimirán en los documentos oficiales de su convenio.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                className="px-6 py-2 rounded-lg border border-gray-600 font-medium text-[14px] hover:bg-[#e6e8ea] transition-colors"
                                type="button"
                            >
                                Guardar Borrador
                            </button>

                            <button
                                className="px-6 py-2 rounded-lg bg-[#1e3a8a] text-white text-[14px] hover:opacity-90 transition-opacity flex items-center gap-2"
                                type="button"
                            >
                                Continuar a Empresa <span className="material-symbols-outlined text-xs">arrow_forward</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
