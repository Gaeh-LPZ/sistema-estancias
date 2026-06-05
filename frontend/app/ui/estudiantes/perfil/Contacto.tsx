interface ContactoProps {
    isEditing: boolean;
}

export default function Contacto({isEditing} : ContactoProps) {
    return (
        <div className="row-span-2 outline outline-gray-300 rounded-md">
            <div className="flex flex-row w-full gap-1.5 items-center p-4 bg-[#f2f4f6] border-b border-b-gray-300">
                <span className="material-symbols-outlined text-secondary">contact_phone</span>
                <h3 className="text-xl font-semibold">Contacto</h3>
            </div>
            <div className="flex flex-col p-4 gap-1.5">
                <label className="flex flex-col text-xs gap-1.5 w-full">Correo Institucional
                    <input disabled={!isEditing} type="email" name="correo_institucional" placeholder="amorales@gs.aulavirtual.mx" className="placeholder:text-[14px] bg-[#f2f4f6] p-2 rounded-md outline outline-gray-300" />
                </label>
                <label className="flex flex-col w-full text-xs gap-1.5">Correo Alternativo
                    <input disabled={!isEditing} type="email" name="correo_alternativo" placeholder="ana.laura.99@gmail.com" className="placeholder:text-[14px] bg-[#f2f4f6] p-2 rounded-md outline outline-gray-300" />
                </label>
                <label className="flex flex-col w-full text-xs gap-1.5">Teléfono Móvil
                    <input disabled={!isEditing} type="tel" name="telefono" placeholder="958 123 4567" className="placeholder:text-[14px] bg-[#f2f4f6] p-2 rounded-md outline outline-gray-300" />
                </label>
                <label className="flex flex-col w-full text-xs gap-1.5">Teléfono de Emergencia
                    <input disabled={!isEditing} type="tel" name="telefono_alternativo" placeholder="958 765 4328" className="placeholder:text-[14px] bg-[#f2f4f6] p-2 rounded-md outline outline-gray-300" />
                </label>
            </div>
        </div>
    );
}