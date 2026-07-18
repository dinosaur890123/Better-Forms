import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

export function middleware(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    const {pathname} = request.nextUrl;

    if (!session && pathname === "/") {
        return NextResponse.redirect(new URL("/welcome", request.url));
    }
    if (session && (pathname === "/welcome" || pathname === "/signin" || pathname === "/signup")) {
        return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
}

export const config = {
     matcher: ["/", "/welcome", "/signin", "/signup"],
};
