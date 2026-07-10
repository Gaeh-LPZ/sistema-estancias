import { handlers } from "@/auth";
import { NextRequest } from "next/server";

const { GET: AuthGET, POST: AuthPOST } = handlers;

function addBasePath(req: NextRequest) {
    const url = new URL(req.url);
    
    if (!url.pathname.startsWith('/estancias')) {
        url.pathname = '/estancias' + url.pathname;
    }
    
    // CAMBIO AQUÍ: Usamos 'any' en lugar de 'RequestInit' para calmar a TypeScript
    const init: any = {
        headers: req.headers,
        method: req.method,
    };
    
    if (req.method === "POST" && req.body) {
        init.body = req.body;
        init.duplex = "half"; 
    }
    
    return new NextRequest(url, init);
}

export async function GET(req: NextRequest) {
    return AuthGET(addBasePath(req));
}

export async function POST(req: NextRequest) {
    return AuthPOST(addBasePath(req));
}