//const { PrismaClient } = require('@prisma/client');
const { prisma } = require('../clients/prismaClient');
//const prisma = prisma

async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, phoneNumber: true },
    });
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}

async function getUserById(phoneNumber) {
  try {
    const user = await prisma.user.findUnique({
      where: { phoneNumber: phoneNumber },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        amounts: {
          select: {
            totalAmount: true
          },
          where: {
            paid: false
          }
        }
      },
    });

    return user;
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    throw new Error('Failed to fetch user');
  }
}

async function getTotalAmount(id){
  try {
    const amount=await prisma.amount.findFirst({
      where:{
        userId:parseInt(id)
      }
    })
    console.log(amount);
    if(amount){
      console.log(amount.totalAmount);
      return amount.totalAmount
    }
  } catch (error) {
    //console.log("HEer");
    console.error(error);
  }
}

module.exports = {
  getUsers,
  getUserById,
  getTotalAmount
};
