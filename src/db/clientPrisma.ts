import { PrismaClient as MongoClient } from '../../prisma/generated/mongodb_client';
import { PrismaClient as PostgresClient } from '../../prisma/generated/postgres_client';
import {Prisma} from '@prisma/client'
import { DefaultArgs } from '../../prisma/generated/postgres_client/runtime/library';

export const DATA_SOURCE = process.env.DATA_SOURCE || 'mongodb';

type ClientPostgres = PostgresClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
type ClientMongo = MongoClient<Prisma.PrismaClientOptions, never, DefaultArgs>;

export const mongoClient: ClientMongo = new MongoClient();
export const postgresClient: ClientPostgres = new PostgresClient();

export let prismaClient: any

if(DATA_SOURCE === 'postgres') {
    prismaClient = postgresClient;
}else {
    prismaClient = mongoClient;
}
