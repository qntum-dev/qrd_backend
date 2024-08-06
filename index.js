const express = require('express');
const { createUser } = require('./prisma/models/User.model');
const { createAmount, getAmountHistory } = require('./prisma/models/Amount.model');
const amountService = require('./services/amountService');
const { prisma } = require('./clients/prismaClient');
const userRouter=require('./routes/userRoutes')
const amountRouter=require('./routes/amountRoutes')
const registerRouter=require('./routes/registerRoute')

const cors=require('cors')
const app = express();
app.use(express.json());

app.use(cors());
app.use('/users',userRouter);

app.use('/users/',amountRouter);

app.use('/user',registerRouter)
// app.post('/users', async (req, res) => {
//   const { name, phoneNumber } = req.body;

//   try {
//     const user = await createUser(name, phoneNumber);
//     res.json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to create user' });
//   }
// });

// app.post('/users/:userId/amounts', async (req, res) => {
//   try {
//     const { amount } = req.body;
//     const { userId } = req.params;
//     // Call the addAmount function to add the amount for the user
//     const newAmount = await amountService.addAmount(parseInt(userId), amount);

//     res.status(201).json(newAmount);
//   } catch (error) {
//     console.error('Error adding amount:', error);
//     res.status(500).json({ error: 'Failed to add amount' });
//   }
// });

// app.get('/users/:userId/amounts', async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const amountHistory = await getAmountHistory(parseInt(userId));
//     res.json(amountHistory);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to fetch amount history' });
//   }
// });

// app.get('/users', async (req, res) => {
//     try {
//       const users = await prisma.user.findMany();
//       res.json(users);
//     } catch (error) {
//       console.error('Error retrieving users:', error);
//       res.status(500).json({ error: 'Failed to retrieve users' });
//     }
//   });

//   app.get('/users/:id', async (req, res) => {
//     const userId = parseInt(req.params.id);
  
//     try {
//       const user = await prisma.user.findUnique({
//         where: {
//           id: userId,
//         },
//       });
  
//       if (user) {
//         res.json(user);
//       } else {
//         res.status(404).json({ error: 'User not found' });
//       }
//     } catch (error) {
//       console.error('Error retrieving user:', error);
//       res.status(500).json({ error: 'Failed to retrieve user' });
//     }
//   });
  

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
