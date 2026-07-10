import { signIn } from "@/auth"; 

export default function GoogleButton() {
    return (
        <form
            action={async () => {
                "use server";
                await signIn('google', { redirectTo: '/estancias/estudiantes/perfil' }); 
            }}
        >
            <button
                type="submit" 
                className="flex flex-row font-bold gap-1.5 text-sm items-center justify-center w-full p-2.5 border border-gray-400 hover:scale-105 transform transition-all cursor-pointer"
            >
                <svg width={24} height={24} aria-label="Logo de Google">
                    <use xlinkHref="/estancias/google-logo.svg"></use>
                </svg>
                Iniciar Sesión con Google
            </button>
        </form>
    );
}