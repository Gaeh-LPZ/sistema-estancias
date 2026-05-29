export default function Page() {
    return (
        <section className="w-screen xl:max-w-5/6">
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
        </section>
    );
}