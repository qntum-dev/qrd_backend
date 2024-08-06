const express = require('express');
const router = express.Router();
const userService = require('../services/userService');


// GET /users
router.get('/', async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /users/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});


router.get('/:id/totalAmount', async (req, res) => {
  const { id } = req.params;
  try {
    const amount = await userService.getTotalAmount(id);
    
      res.json(amount);
    
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});





module.exports = router;
