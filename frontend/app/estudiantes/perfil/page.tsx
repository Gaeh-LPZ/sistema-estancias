export default function Page() {
    return (
        <section className="w-screen xl:max-w-5/6 overflow-y-auto">
            <header className="flex flex-row p-10 items-center justify-between border-b border-gray-400">
                <div className="flex flex-row gap-5 items-center">
                    <p className="text-4xl font-bold w-20 h-20 md:w-24 md:h-24 rounded-md bg-[#b6c4ff] border-4 border-[#f7f9fb] flex items-center justify-center shadow-sm">GL</p>
                    <div className="flex flex-col gap-0.5">
                        <h1 className="font-semibold text-2xl md:text-[28px] mb-1">Gael Lopez Bautista</h1>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 text-sm">
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">badge</span> 2023020305</span>
                            <span className="hidden sm:inline text-outline">•</span>
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">mail</span> lobg050328@gs.utm.mx</span>
                        </div>
                    </div>
                </div>

                <button className="flex items-center justify-center gap-2 bg-[#1e3a8a] text-[#90a8ff] px-4 py-2 rounded-lg font-medium text-xs hover:bg-[#00236f] transition-colors shadow-sm self-start md:self-auto w-full md:w-auto">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Editar perfil
                </button>
            </header>

            <div className="grid grid-cols-3 grid-rows-4 p-7 gap-3">
                <div className="col-span-2 row-span-2 outline outline-gray-300 rounded-md">
                    <div className="flex flex-row w-full gap-1.5 items-center p-4 bg-[#f2f4f6] border-b border-b-gray-300">
                        <span className="material-symbols-outlined text-secondary">person</span>
                        <h3 className="text-xl font-semibold">Datos Personales</h3>
                    </div>
                    <div className="p-4 flex flex-col gap-1.5">
                        <div className="flex flex-row w-full justify-between gap-3">
                            <label className="flex flex-col w-1/2 text-xs gap-1.5">Nombre(s)
                                <input type="text" name="nombre" placeholder="Ana Laura" className="placeholder:text-[14px] bg-[#f2f4f6] p-2 rounded-md outline outline-gray-300" />
                            </label>
                            <label className="flex flex-col w-1/2 text-xs gap-1.5">Apellidos
                                <input type="text" name="Apellidos" placeholder="Morales Díaz" className="placeholder:text-[14px] bg-[#f2f4f6] p-2 rounded-md outline outline-gray-300" />
                            </label>
                        </div>
                        <div className="flex flex-row w-full justify-between gap-3">
                            <label className="flex flex-col w-1/2 text-xs gap-1.5">Fecha de nacimiento
                                <input type="date" name="fecha_nacimiento" className="placeholder:text-[14px] bg-[#f2f4f6] p-2 rounded-md outline outline-gray-300" />
                            </label>
                            <label className="flex flex-col w-1/2 text-xs gap-1.5">Género
                                <input type="text" name="genero" placeholder="Femenino" className="placeholder:text-[14px] bg-[#f2f4f6] p-2 rounded-md outline outline-gray-300" />
                            </label>
                        </div>
                        <label className="flex flex-col w-full text-xs gap-1.5">CURP
                            <input type="text" name="curp" placeholder="MODA000815MOXRRRA1" className="placeholder:text-[14px] bg-[#f2f4f6] p-2 rounded-md outline outline-gray-300" />
                        </label>
                        <label className="flex flex-col w-full text-xs gap-1.5">NSS (Número de Seguridad Social)
                            <input type="text" name="nss" placeholder="78945612301" className="placeholder:text-[14px] bg-[#f2f4f6] p-2 rounded-md outline outline-gray-300" />
                        </label>
                    </div>
                </div>
                <div className="row-span-2 outline outline-gray-300 rounded-md">
                    <div className="flex flex-row w-full gap-1.5 items-center p-4 bg-[#f2f4f6] border-b border-b-gray-300">
                        <span className="material-symbols-outlined text-secondary">contact_phone</span>
                        <h3 className="text-xl font-semibold">Contacto</h3>
                    </div>
                    <div className="flex flex-col p-4 gap-1.5">
                        <label className="flex flex-col text-xs gap-1.5 w-full">Correo Institucional
                            <input type="email" name="correo_institucional" placeholder="amorales@gs.aulavirtual.mx" className="placeholder:text-[14px] bg-[#f2f4f6] p-2 rounded-md outline outline-gray-300" />
                        </label>
                        <label className="flex flex-col w-full text-xs gap-1.5">Correo Alternativo
                            <input type="email" name="correo_alternativo" placeholder="ana.laura.99@gmail.com" className="placeholder:text-[14px] bg-[#f2f4f6] p-2 rounded-md outline outline-gray-300" />
                        </label>
                        <label className="flex flex-col w-full text-xs gap-1.5">Teléfono Móvil
                            <input type="tel" name="telefono" placeholder="958 123 4567" className="placeholder:text-[14px] bg-[#f2f4f6] p-2 rounded-md outline outline-gray-300" />
                        </label>
                        <label className="flex flex-col w-full text-xs gap-1.5">Teléfono de Emergencia
                            <input type="tel" name="telefono_alternativo" placeholder="958 765 4328" className="placeholder:text-[14px] bg-[#f2f4f6] p-2 rounded-md outline outline-gray-300" />
                        </label>
                    </div>
                </div>
                <div className="col-span-2 row-span-2 outline outline-gray-300 rounded-md">
                    <div className="flex flex-row w-full gap-1.5 items-center p-4 bg-[#f2f4f6] border-b border-b-gray-300">
                        <span className="material-symbols-outlined text-secondary">school</span>
                        <h3 className="text-xl font-semibold">Información Académica</h3>
                    </div>
                    <div className="p-4 flex flex-col gap-1.5">
                        <div className="flex flex-row w-full justify-between gap-3">
                            <label className="flex flex-col w-1/2 text-xs gap-1.5">Matrícula UMAR
                                <input type="text" name="matricula" placeholder="18030245" className="placeholder:text-[14px] bg-[#f2f4f6] p-2 rounded-md outline outline-gray-300" />
                            </label>
                            <label className="flex flex-col w-1/2 text-xs gap-1.5">Grupo
                                <input type="text" name="grupo" placeholder="901-A" className="placeholder:text-[14px] bg-[#f2f4f6] p-2 rounded-md outline outline-gray-300" />
                            </label>
                        </div>
                        <label className="flex flex-col w-full text-xs gap-1.5">Carrera
                            <input type="text" name="" placeholder="Licenciatura en Economía" className="placeholder:text-[14px] bg-[#f2f4f6] p-2 rounded-md outline outline-gray-300" />
                        </label>
                        <div className="flex flex-col gap-1 sm:col-span-2 mt-2">
                            <label className="font-medium text-xs flex justify-between">
                                <span>Avance de Créditos</span>
                                <span className="font-bold text-blue-900">85%</span>
                            </label>
                            <div className="w-full rounded-full h-2 mt-1">
                                <div className="bg-blue-900 h-2 rounded-full w-[85%]"></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Elegible para Estancias Profesionales</p>
                        </div>
                    </div>
                </div>
                <div className="row-span-1 outline outline-gray-300 rounded-md">
                    <div className="flex flex-row w-full gap-1.5 items-center p-4 bg-[#f2f4f6] border-b border-b-gray-300">
                        <span className="material-symbols-outlined text-secondary">home</span>
                        <h3 className="text-xl font-semibold">Domicilio</h3>
                    </div>
                    <div className="p-4">
                        <p>km 250, Mexico 200</p>
                        <p>Bahías de Huatulco</p>
                        <p>Oaxaca, C.P. 70989</p>
                    </div>
                </div>
            </div>
        </section>
    );
}