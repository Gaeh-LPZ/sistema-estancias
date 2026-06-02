import CardWrapper from "@/app/ui/admin/Cards";
import UploadExcelButton from "@/app/ui/admin/UploadExcelButton";
import TablaEstudiantes from "@/app/ui/admin/TablaEstudiantes";
import BotonExportar from "@/app/ui/admin/ExportarExcel";
import BuscadorEstudiantes from "@/app/ui/admin/BuscadorEstudiante";
import { Suspense } from "react";

export default async function EstudiantesPage({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        carrera?: string;
        estado?: string;
    };
}) {
    const resolvedParams = await searchParams;

    const query = (resolvedParams?.query as string) || '';
    const carrera = (resolvedParams?.carrera as string) || '';
    const estado = (resolvedParams?.estado as string) || '';
    return (
        <section className="flex flex-col gap-6 mb-3 p-7 w-screen xl:max-w-5/6 bg-[#f7f9fb]">
            <header className="flex flex-row justify-between items-center">
                <div>
                    <h2 className="font-bold text-3xl mb-1">Directorio de Estudiantes</h2>
                    <p className="text-gray-500">Gestione y valide los procesos de estancias profesionales.</p>
                </div>
                <div className="flex flex-row gap-2">
                    <UploadExcelButton />
                    <BotonExportar />
                </div>
            </header>
            <CardWrapper />
            <Suspense fallback={<div className="p-4 text-gray-500">Cargando buscador...</div>}>
                <BuscadorEstudiantes />
            </Suspense>
            <Suspense 
                key={query + carrera + estado} 
                fallback={<div className="p-8 text-center text-[#1e3a8a] font-medium animate-pulse">Actualizando tabla...</div>}
            >
                <TablaEstudiantes query={query} carrera={carrera} estado={estado} />
            </Suspense>
        </section>
    );
}