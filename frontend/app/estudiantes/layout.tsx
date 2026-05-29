import { inter } from "../lib/fonts";
import NavBarEstudiantes from "../ui/estudiantes/NavBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'estudiantes'
}

export default function Layout({children,}:Readonly<{children: React.ReactNode;}>){
    return (
        <main className={`${inter.className} h-screen w-screen flex flex-row`}>
            <NavBarEstudiantes/>
            {children}
        </main>
    );
}