interface InformacionAcademicaProps {
    isEditing : boolean;
}

export default function InformacionAcademica({ isEditing } : InformacionAcademicaProps) {
    return (
        <div className="col-span-2 row-span-2 outline outline-gray-300 rounded-md">
            <div className="flex flex-row w-full gap-1.5 items-center p-4 bg-[#f2f4f6] border-b border-b-gray-300">
                <span className="material-symbols-outlined text-secondary">school</span>
                <h3 className="text-xl font-semibold">Información Académica</h3>
            </div>
            <div className="p-4 flex flex-col gap-1.5">
                <div className="flex flex-row w-full justify-between gap-3">
                    <label className="flex flex-col w-1/2 text-xs gap-1.5">Matrícula UMAR
                        <input disabled={!isEditing} type="text" name="matricula" placeholder="18030245" className="placeholder:text-[14px] bg-[#f2f4f6] p-2 rounded-md outline outline-gray-300" />
                    </label>
                    <label className="flex flex-col w-1/2 text-xs gap-1.5">Grupo
                        <input disabled={!isEditing} type="text" name="grupo" placeholder="901-A" className="placeholder:text-[14px] bg-[#f2f4f6] p-2 rounded-md outline outline-gray-300"/>
                    </label>
                </div>
                <label className="flex flex-col w-full text-xs gap-1.5">Carrera
                    <input disabled={!isEditing} type="text" name="" placeholder="Licenciatura en Economía" className="placeholder:text-[14px] bg-[#f2f4f6] p-2 rounded-md outline outline-gray-300" />
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
    );
}