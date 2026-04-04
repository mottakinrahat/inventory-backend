"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../prisma/generated/prisma");
const prisma = new prisma_1.PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
});
exports.default = prisma;
