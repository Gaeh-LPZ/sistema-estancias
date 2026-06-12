import HeaderForm from "./HeaderForm";
import FormEstudiantes from "./FormEstudiantes";

export default function FormUI({ correoUsuario, datosIniciales }: { correoUsuario: string, datosIniciales: any }) {
    console.log(datosIniciales);
    return (
        <div className="h-full overflow-y-auto flex-1 p-4 md:p-margin-8 bg-[#f2f4f6]">
            <div className="max-w-4xl mx-auto">
                <HeaderForm/>
                <div className="rounded-xl shadow-sm border border-gray-300 overflow-hidden">
                    <div className="bg-white p-6 md:p-6 border-b border-gray-300">
                        <h3 className="font-semibold mb-1">
                            1. Información del Estudiante
                        </h3>
                        <p className="font-[14px]">
                            Verifique y complete sus datos académicos actuales.
                        </p>
                    </div>
                    <FormEstudiantes correoUsuario={correoUsuario} datosIniciales={datosIniciales}/>
                </div>
            </div>
        </div>
    );
}
