import { inter } from "../lib/fonts";
import Image from "next/image";
import GoogleButton from "../ui/GoogleButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'sign-in'
}

export default function Page() {
    return (
        <main className={`${inter.className} h-screen w-screen flex`}>
            <section className="h-full w-1/3 flex flex-col items-center justify-center p-20 gap-7">
                <Image src={'/estancias/umar-logo.webp'} alt="Logo de la universidad del mar" width={90} height={90} className=""></Image>
                <header className="w-full">
                    <h1 className="text-3xl font-bold">Gestión de Estancias</h1>
                    <p className="text-gray-500">Universidad del Mar</p>
                </header>
                <GoogleButton/>
            </section>
            <aside className="h-full w-2/3 relative overflow-hidden">
                <Image src={'/estancias/CPA-2023.jpg'} loading="eager" alt="fondo decorativo de la umar" width={1018} height={398} className="absolute inset-0 w-full h-full object-cover"></Image>
                <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-md rounded-xl flex items-start gap-3 p-6">
                    <span className="material-symbols-outlined text-[#1e3a8a] text-[32px]">campaign</span>
                    <div>
                        <h3 className="font-semibold text-[18px] mb-1">Periodo de Validación Abierto</h3>
                        <p className="text-sm">El sistema de carga de documentos se encuentra activo. Recuerde verificar los convenios antes del cierre administrativo.</p>
                    </div>
                </div>
            </aside>
        </main>
    );
}