const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const jwtGenerator = require("../utils/jwtGenerator");
const { prisma } = require("../clients/prismaClient");

// const prisma = new PrismaClient();

//const prisma=prisma;
async function registerUser(name, phoneNumber, password) {
  const user = await prisma.user.findUnique({
    where: {
      phoneNumber: phoneNumber,
    },
  });

  if (user) {
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const bcryptPassword = await bcrypt.hash(password, salt);

  const newUser = await prisma.user.create({
    data: {
      name: name,
      phoneNumber: phoneNumber,
      user_password: bcryptPassword,
    },
  });
  console.log(newUser);
  const jwtToken = jwtGenerator(newUser.id);

  return jwtToken;
}

async function loginUser(phoneNumber, password) {
  const user = await prisma.user.findUnique({
    where: {
      phoneNumber: phoneNumber,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const validPassword = await bcrypt.compare(password, user.user_password);

  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  const jwtToken = jwtGenerator(user.id);
  return {jwtToken:jwtToken,user:user};
}

module.exports = { registerUser, loginUser };
