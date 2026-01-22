import { PrismaClient } from "./prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prisma: PrismaClient

try {
  if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient()
  } else {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
      })
    }
    prisma = globalForPrisma.prisma
  }
} catch (error) {
  console.error("Prisma Client 초기화 오류:", error)
  throw error
}

export { prisma }
