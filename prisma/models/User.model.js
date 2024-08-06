const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createUser = async (name, phoneNumber) => {
  return prisma.user.create({
    data: {
      name: String(name),
      phoneNumber: String(phoneNumber),
    },
  });
};

module.exports = {
  createUser,
};
