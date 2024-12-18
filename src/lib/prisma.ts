import {PrismaClient} from "@prisma/client"



export const prisma = new PrismaClient({
  //show all executed queries in the database to verify unnecessary ones 
  log: ["query"]
})

