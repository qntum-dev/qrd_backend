const express = require('express');
const router = express.Router();
const amountService = require('../services/amountService');

// GET /amounts

router.get('/:userId/showAmount',async(req,res)=>{
  const {userId}=req.params;
  try {
    const amount =await amountService.showAmount(userId);
    res.json(amount)
  } catch (error) {
    console.error("cannot get amount");
  }
  
  
})


// POST /amounts
router.post('/:userId/amounts', async (req, res) => {

  console.log("reeeee");
  console.log(req.params);
  console.log("Request body is");
  console.log(req.body);
  const { amount } = req.body;
  const {userId}=req.params;

  console.log(`userId is ${userId}`);
  try {
    const createdAmount = await amountService.addAmount(userId, amount);
    res.json(createdAmount);
  } catch (error) {
    console.error('Error adding amount:', error);
    res.status(500).json({ error: 'Failed to add amount' });
  }
});


router.post('/:userId/payamount', async (req, res) => {

  console.log("reeeee");
  console.log(req.params);
  console.log("Request body is");
  console.log(req.body);
  const { amount } = req.body;
  const {userId}=req.params;

  console.log(`userId is ${userId}`);
  try {
    const createdAmount = await amountService.subtractAmount(userId, amount);
    res.json(createdAmount);
  } catch (error) {
    console.error('Error adding amount:', error);
    res.status(500).json({ error: 'Failed to subtract amount' });
  }
});



// PUT /pay/:userId
router.put('/pay/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const updatedAmount = await amountService.markAmountAsPaid(userId);
    res.json(updatedAmount);
  } catch (error) {
    console.error(`Error marking amount as paid for user ${userId}:`, error);
    res.status(500).json({ error: 'Failed to mark amount as paid' });
  }
});


router.get('/get/pendingVerifications/:userId',async(req,res)=>{
  const {userId}=req.params;

  try {
    const showPendingVerifications=await amountService.showPendingVerifications(userId);
    res.json(showPendingVerifications)
  } catch (error) {
    console.error(error);
  }
})


router.put('/verify/:payId',async(req,res)=>{
  const {payId}=req.params;
  const {confirmation}=req.body


  try {
    const verify=await amountService.verifyPay(payId,confirmation)
    res.json(verify)
  } catch (error) {
    console.error(error);
  }
})

router.get('/:id/showAmountHistory/',async(req,res)=>{
  const {id}=req.params;
  console.log(id);
  console.log(req.query);
  const page=req.query.page;
  const pageSize=req.query.pagesize;
  try {
    const history=await amountService.showAmountHistory(id,page,pageSize);
    
    res.json(history);
  } catch (error) {
    console.error(error);
  }
})
module.exports = router;
