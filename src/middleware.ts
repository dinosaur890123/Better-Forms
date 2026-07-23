import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

export function middleware(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    const {pathname} = request.nextUrl;
    const isProtected = pathname === "/dashboard" || (pathname.startsWith("/forms/") && pathname.endsWith("/responses"));

    if (!session && isProtected) {
        return NextResponse.redirect(new URL("/", request.url));
    }
    if (session && (pathname === "/" || pathname === "/signin" || pathname === "/signup")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/signin", "/signup", "/dashboard", "/forms/:id/responses", "/forms/:id/analytics"],
};
