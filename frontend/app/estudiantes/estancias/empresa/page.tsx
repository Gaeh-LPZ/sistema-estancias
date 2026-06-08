export default function Page() {
    const input_style = 'h-10 px-3 rounded-md border border-gray-400 bg-[#f7f9fb] focus:border-[#1e3a8a] outline-none placeholder:font-normal font-normal';
    const h4_style = 'font-semibold mb-6 pb-1 border-b border-gray-400';
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

                <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 mb-6 flex items-center justify-between">
                    <div className="flex flex-col items-center step-active w-24">
                        <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center step-icon mb-2">
                            <span className="font-semibold text-lg">1</span>
                        </div>
                        <span className="font-medium text-lg text-center text-[#1e3a8a]">
                            Estudiantes
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
                    <div className="bg-white p-6 md:p-6 border-b border-gray-300">
                        <h3 className="font-semibold mb-1">
                            2. Información de la empresa
                        </h3>
                        <p className="font-[14px]">
                            Verifique y complete los datos de la entidad receptora
                        </p>
                    </div>

                    <form className="bg-white h-full p-6 md:p-6 flex flex-col gap-6">
                        {/* Sección 1: Datos de la empresa */}
                        <div>
                            <h4 className={h4_style}>
                                Datos de la empresa
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                <label className="md:col-span-3 flex flex-col gap-1 text-sm font-semibold">Nombre de la Entidad o Empresa
                                    <input type="text" name="nombre" placeholder="Instituto Nacional de Estadistica" className={input_style} />
                                </label>
                                <label className="md:col-span-3 flex flex-col gap-1 text-sm font-semibold"> Área o departamento
                                    <input type="text" name="area" placeholder="Recursos Humanos" className={input_style} />
                                </label>
                                <label className="md:col-span-3 flex flex-col gap-1 text-sm font-semibold">Calle y Número
                                    <input type="text" name="calle" placeholder="Av. Insurgentes Sur" className={input_style} />
                                </label>

                                <label className="flex flex-col gap-1 text-sm font-semibold">Colonia
                                    <input type="text" name="colonia" className={input_style} />
                                </label>
                                <label className="flex flex-col gap-1 text-sm font-semibold">Código Postal
                                    <input type="text" name="cp" className={input_style} />
                                </label>
                                <label className="flex flex-col gap-1 text-sm font-semibold">Ciudad
                                    <input type="text" name="ciudad" className={input_style} />
                                </label>

                                <label className="flex flex-col gap-1 text-sm font-semibold">Municipio/Alcadía
                                    <input type="text" name="municipio" className={input_style} />
                                </label>
                                <label className="flex flex-col gap-1 text-sm font-semibold">Estado
                                    <input type="text" name="estado" className={input_style} />
                                </label>
                                <label className="flex flex-col gap-1 text-sm font-semibold">País
                                    <input type="text" name="pais" className={input_style} />
                                </label>
                            </div>
                        </div>
                        {/* Sección 2: Clasificación de la empresa*/}
                        <div>
                            <h4 className={h4_style}>
                                Clasificiación de la empresa
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <label className="flex flex-col gap-1 text-sm font-semibold">Sector
                                    <select name="sector" className={input_style}>
                                        <option value="">Seleccionar...</option>
                                        <option value="Público">Público</option>
                                        <option value="Privado">Privado</option>
                                        <option value="Social">Social</option>
                                    </select>
                                </label>
                                <label className="flex flex-col gap-1 text-sm font-semibold">Tamaño
                                    <select name="tamanio" className={input_style}>
                                        <option value="">Seleccionar...</option>
                                        <option value="Micro">Micro</option>
                                        <option value="Pequeña">Pequeña</option>
                                        <option value="Mediana">Mediana</option>
                                        <option value="Grande">Grande</option>
                                    </select>
                                </label>
                                <label className="flex flex-col gap-1 text-sm font-semibold">Nivel
                                    <select name="nivel" className={input_style}>
                                        <option value="">Seleccionar...</option>
                                        <option value="Estatal">Estatal</option>
                                        <option value="Nacional">Nacional</option>
                                        <option value="Internacional">Internacional</option>
                                    </select>
                                </label>
                            </div>
                        </div>

                        {/* Sección 3: Información de Contacto */}
                        <div>
                            <h4 className={h4_style}>
                                Información de Contacto General
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <label className="flex flex-col gap-1 text-sm font-semibold">Telefono
                                    <input type="tel" name="telefono" placeholder="55 1234 5678" className={input_style} />
                                </label>
                                <label className="flex flex-col gap-1 text-sm font-semibold">Página Web
                                    <input type="text" name="pagina_web" placeholder="https://www.ejemplo.com" className={input_style} />
                                </label>
                                <div className="flex flex-col bg-[#f7f9fb] md:col-span-2 gap-4 p-6 rounded-md border border-gray-300">
                                    <div>
                                        <h2 className="text-[#00236f] font-semibold text-xl">Datos para la carta de presentación (Titular)</h2>
                                        <p className="text-sm text-gray-500">Persona a quien irá dirigida la carta oficial de presentación</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <label className="flex flex-col gap-1 text-sm font-semibold">Nombre Completo y Grado
                                            <input type="text" name="nombre_titular" placeholder="Ingeniero Juan Pérez" className={input_style}/>
                                        </label>
                                        <label className="flex flex-col gap-1 text-sm font-semibold">Cargo
                                            <input type="text" name="cargo_titular" placeholder="Director General" className={input_style} />
                                        </label>
                                        <label className="flex flex-col gap-1 text-sm font-semibold">Correo Electrónico
                                            <input type="text" name="correo_titular" placeholder="ejemplo@gmail.com" className={input_style} />
                                        </label>
                                    </div>
                                </div>
                                <div className="flex flex-col bg-[#f7f9fb] md:col-span-2 gap-4 p-6 rounded-md border border-gray-300">
                                    <div>
                                        <h2 className="text-[#00236f] font-semibold text-xl">Datos del Asesor / Contacto Directo</h2>
                                        <p className="text-sm text-gray-500">Persona que supervisará tus actividades diarias</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <label className="flex flex-col gap-1 text-sm font-semibold">Nombre Completo y Grado
                                            <input type="text" name="nombre_titular" placeholder="Licenciada Ana Gomez" className={input_style}/>
                                        </label>
                                        <label className="flex flex-col gap-1 text-sm font-semibold">Cargo
                                            <input type="text" name="cargo_titular" placeholder="Gerente de TI" className={input_style} />
                                        </label>
                                        <label className="flex flex-col gap-1 text-sm font-semibold">Correo Electrónico
                                            <input type="text" name="correo_titular" placeholder="ejemplo@gmail.com" className={input_style} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between gap-3 mt-6">
                            <button className="px-6 py-2 border border-gray-300 text-xs rounded hover:bg-[#f2f4f6] transition-colors">Atras</button>
                            <button
                                className="px-6 py-2 rounded-lg bg-[#1e3a8a] text-white text-[14px] hover:opacity-90 transition-opacity flex items-center gap-2"
                                type="button"
                            >
                                Continuar a Detalles <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
