import Prisma from '@prisma/client'


export const DATA_SOURCE = process.env.DATA_SOURCE;




export const prismaClient = new Prisma.PrismaClient();


