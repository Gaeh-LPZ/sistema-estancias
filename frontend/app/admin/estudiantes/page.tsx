import CardWrapper from "@/app/ui/admin/Cards";
import UploadExcelButton from "@/app/ui/admin/UploadExcelButton";
import TablaEstudiantes from "@/app/ui/admin/TablaEstudiantes";

export default function Page() {
    return (
        <section className="flex flex-col gap-6 mb-3 p-7 w-screen xl:max-w-5/6 bg-[#f7f9fb]">
            <header className="flex flex-row justify-between items-center">
                <div>
                    <h2 className="font-bold text-3xl mb-1">Directorio de Estudiantes</h2>
                    <p className="text-gray-500">Gestione y valide los procesos de estancias profesionales.</p>
                </div>
                <div className="flex flex-row gap-2">
                    <UploadExcelButton/>
                    <button className="hidden bg-white md:flex items-center gap-1 border border-gray-300 py-2 px-6 rounded-md font-medium text-xs hover:bg-[#f2f4f6] transition-colors shadow-sm cursor-pointer">
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        Exportar Estudiantes
                    </button>
                </div>
            </header>
            <CardWrapper />
            <TablaEstudiantes/>
        </section>
    );
}