import {PrismaClient} from "@prisma/client";
import {PrismaPg} from "@prisma/adapter-pg";
import {Pool} from "pg";

const prismaClientSingleton = () => {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        console.warn("Database url not set :(");
        return new PrismaClient()
    }

    const pool = new Pool({connectionString});
    const adapter = new PrismaPg(pool);
    return new PrismaClient({adapter});
};

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}