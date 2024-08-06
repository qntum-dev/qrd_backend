const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const createAmount = async (userId, totalAmount) => {
  return prisma.amount.create({
    data: {
      totalAmount,
      userId,
    },
  });
};

const getAmountHistory = async (userId) => {
  return prisma.amount.findMany({
    where: {
      userId,
    },
    include: {
      user: true,
      amountHistory: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });
};

module.exports = {
  createAmount,
  getAmountHistory,
};
