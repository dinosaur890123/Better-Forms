import prisma from "./db";
import {cookies} from "next/headers";

export async function getCurrentUser() {
    const id = (await cookies()).get("session")?.value;
    if (!id) return null;
    const session = await prisma.session.findUnique({
        where: {id},
        include: {user: true},
    });
    return session?.user ?? null;
}