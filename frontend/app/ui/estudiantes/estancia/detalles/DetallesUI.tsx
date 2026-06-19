import HeaderDetalles from "@/app/ui/estudiantes/estancia/detalles/HeaderDetalles";
import Detalles from "@/app/ui/estudiantes/estancia/detalles/Detalles";

export default function DetallesUI() {
    return (
        <div className="h-full overflow-y-auto flex-1 p-10 md:p-margin-8 bg-[#f2f4f6] w-5/6">
            <HeaderDetalles />
            <Detalles />
            <div className="flex flex-row bg-white mt-6 items-center justify-between p-4 rounded-lg border border-[#c5c5d3]">
                <div className="flex flex-row w-1/2 gap-1.5">
                    <span className="material-symbols-outlined text-[20px] text-[#00236f]" data-icon="info">info</span>
                    <p>Al confirmar, el convenio pasará a estado de <strong>Pendiente de validación</strong></p>
                </div>
                <div className="flex flex-row gap-2.5">
                    <button className="flex flex-row items-center gap-1 border border-[#c5c5d3] p-2 rounded-md hover:scale-105 transition-all transform cursor-pointer">
                        <span className="material-symbols-outlined text-[18px]" data-icon="edit">edit</span>
                        Editar Información
                    </button>
                    <button className="flex flex-row items-center text-white gap-1 p-2 rounded-md bg-[#1e3a8a] hover:scale-105 transition-all transform cursor-pointer">
                        <span className="material-symbols-outlined text-[18px]" data-icon="send">send</span>
                        Confirmar y envíar
                    </button>
                </div>
            </div>
        </div>
    );
}