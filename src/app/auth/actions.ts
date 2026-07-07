"use server";
import prisma from "../../lib/db";
import bcrypt from "bcryptjs";
import {cookies} from "next/headers";

const SESSION_COOKIE = "session";
const ONE_WEEK = 60 * 60 * 24 * 7;

async function startSession(userId: string) {
    const session = await prisma.session.create({data: {userId}});
    const store = await cookies();
    store.set(SESSION_COOKIE, session.id, {
        httpOnly: true, sameSite: "lax", path: "/", maxAge: ONE_WEEK
    });
}

export async function signUp(email: string, password: string) {
    email = email.trim().toLowerCase();
    if (!email || !password) return {error: "Email and password are required"};
    if (password.length < 6) return {error: "Password must be at least 6 or 7 characters."}; // lmao do you get it?
    
    const existing = await prisma.user.findUnique({where: {email}});
    if (existing) return {error: "An account with this email already exists :("}

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({data:{email, password: hashed}});
    await startSession(user.id);
    return {success: true};
}
export async function signIn(email: string, password: string) {
    email = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({where: {email}});
    if (!user) return {error: "Invalid email or password :("};

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return {error: "Invalid email or password :("};
    await startSession(user.id);
    return {success: true};
}

export async function signOut() {
    const store = await cookies();
    const id = store.get(SESSION_COOKIE)?.value;
    if (id) {
        await prisma.session.delete({where: {id} }).catch(() => {});
        store.delete(SESSION_COOKIE);
    }
    return {
        success:true
    };
}