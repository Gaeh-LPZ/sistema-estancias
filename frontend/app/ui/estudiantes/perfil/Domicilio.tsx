interface DomicilioProps{
    isEditing: boolean;
}

export default function Domicilio({isEditing} : DomicilioProps) {
    return (
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
    );
}