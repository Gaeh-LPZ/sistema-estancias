import { inter } from "../lib/fonts";
import NavBarEstudiantes from "../ui/estudiantes/NavBar";
import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
    title: 'estudiantes'
}

export default function Layout({children,}:Readonly<{children: React.ReactNode;}>){
    return (
        <main className={`${inter.className} h-screen w-screen flex flex-row overflow-hidden`}>
            <NavBarEstudiantes/>
            {children}
            <Toaster richColors position="top-right"/>
        </main>
    );
}