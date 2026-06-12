export default function HeaderForm() {
    return (
        <>
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
        </>
    );
}