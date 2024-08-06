// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

const { parse } = require("dotenv");
const { prisma } = require("../clients/prismaClient");

//const prisma=prisma;

async function addAmount(userId, amount) {
  try {
    let createdAmount;
    
    const latestAmount = await prisma.amount.findFirst({
      where: {
        userId: parseInt(userId),
      },
      orderBy: {
        id: 'desc',
      },
    });

    if (latestAmount) {
      console.log("input amount is "+amount);
      const newTotalAmount = parseFloat(latestAmount.totalAmount) + parseFloat(amount);
      console.log("amount is"+newTotalAmount);

      createdAmount = await prisma.amount.update({
        where: {
          id: latestAmount.id,
        },
        data: {
          totalAmount: newTotalAmount,
          paid:false
        },
      });
    } 
    else {
      createdAmount = await prisma.amount.create({
        data: {
          totalAmount: parseFloat(amount),
          userId: parseInt(userId),
        },
      });
    }

    const amountRecord = await prisma.amountHistory.create({
      data: {
        amount,
        amountId: createdAmount.id,
        userId:parseInt(userId),
        labelAddAmount:true,
        receivedPayment:false,
        verifyPay: true,
      },
    });
    

    return createdAmount;
  } catch (error) {
    console.error('Error adding amount:', error);
    throw new Error('Failed to add amount');
  }
}

async function subtractAmount(userId,amount){
  try {
    let createdAmount;

    const latestAmount=await prisma.amount.findFirst({
      where:{
        userId:parseInt(userId),
      },
      orderBy:{
        id:'desc',
      },
    });

    if(latestAmount){
      console.log("input amount is "+amount);
      let newTotalAmount=parseFloat(latestAmount.totalAmount)-parseFloat(amount);
      let paid=false;
      if(newTotalAmount<=0){
        paid=true;
        newTotalAmount=0;
      }
      createdAmount=await prisma.amount.update({
        where:{
          id:latestAmount.id,
        },
        data:{
          totalAmount:newTotalAmount,
          paid:paid
        }
      })

      const amountRecord = await prisma.amountHistory.create({
        data: {
          amount,
          amountId: createdAmount.id,
          userId:parseInt(userId),
          labelAddAmount:false,
          receivedPayment:true,
          verifyPay: false,
        },
      });
      
  
      return createdAmount;

    }

  } catch (error) {
    console.error('Error adding amount:', error);
    throw new Error('Failed to add amount');
  }
}

async function showAmount(userId){
  try {
    let createdAmount;
    
    const latestAmount = await prisma.amount.findFirst({
      where: {
        userId: parseInt(userId),
      },
      orderBy: {
        id: 'desc',
      },
    });

    if (latestAmount) {
      createdAmount=latestAmount.totalAmount;

      
    } 
    
  } catch (error) {
    console.error(`Error getting ${userId}:`, error);
    throw new Error('Failed to get amount');
  }
}

async function markAmountAsPaid(userId) {
  
  try {
    const amountsToUpdate = await prisma.amount.findMany({
      where: {
        userId: parseInt(userId),
      },
    });

    const updatedAmounts = await Promise.all(
      amountsToUpdate.map(async (amount) => {
        const updatedAmount = await prisma.amount.update({
          where: {
            id: amount.id,
          },
          data: {
            totalAmount: 0,
            paid: true,
          },
        });
        return updatedAmount;
      })
    );
     // Delete the amount history records associated with the amounts
     await prisma.amountHistory.deleteMany({
      where: {
        amountId: {
          in: updatedAmounts.map((amount) => amount.id),
        },
      },
    });

    return updatedAmounts;
  } catch (error) {
    console.error(`Error marking amounts as paid for user ${userId}:`, error);
    throw new Error('Failed to mark amounts as paid');
  }
}

async function markAmountAsUnpaid(userId) {
  try {
    const amountsToUpdate = await prisma.amount.findMany({
      where: {
        userId: parseInt(userId),
      },
    });

    const updatedAmounts = await Promise.all(
      amountsToUpdate.map(async (amount) => {
        const updatedAmount = await prisma.amount.update({
          where: {
            id: amount.id,
          },
          data: {
            totalAmount: 0,
            paid: false, // Set paid to false
          },
        });
        return updatedAmount;
      })
    );

    return updatedAmounts;
  } catch (error) {
    console.error(`Error marking amounts as unpaid for user ${userId}:`, error);
    throw new Error('Failed to mark amounts as unpaid');
  }
}

async function showPendingVerifications(userId){
  try {
    const toVerify=await prisma.amountHistory.findMany({
      where:{
        userId:parseInt(userId),
        receivedPayment:true,
        verifyPay:false
      },
    })

    console.log(toVerify);
    return toVerify


  } catch (error) {
    console.error(error);
  }
}

async function verifyPay(payId, confirmation) {
  try {
    console.log('Confirmation:', Boolean(confirmation));

    const verify = await prisma.amountHistory.update({
      where: {
        id: parseInt(payId),
      },
      data: {
        verifyPay: Boolean(confirmation),
        receivedPayment: Boolean(confirmation),
      },
    });

    console.log('Verify record:', verify);

    const latestAmount = await prisma.amount.findFirst({
      where: {
        userId: parseInt(verify.userId),
      },
    });

    console.log('Latest amount:', latestAmount);

    if (confirmation && latestAmount.totalAmount === 0) {
      console.log(`Confirmation is ${confirmation} and totalAmount is ${latestAmount.totalAmount}`);
      // Delete all records associated with the user ID (verify.userId)
      await prisma.amountHistory.deleteMany({
        where: {
          userId: parseInt(verify.userId),
        },
      });
    }

    if (!confirmation && verify) {
      const latestAmount = await prisma.amount.findFirst({
        where: {
          userId: parseInt(verify.userId),
        },
      });

      if (latestAmount) {
        let newTotalAmount = parseFloat(latestAmount.totalAmount) + parseFloat(verify.amount);
        let paid = false;

        await prisma.amount.update({
          where: {
            id: latestAmount.id,
          },
          data: {
            totalAmount: newTotalAmount,
            paid: paid,
          },
        });

        console.log('Updated latest amount:', newTotalAmount);
      }
    }

    // Delete the record after verification
    

    return verify;
  } catch (error) {
    console.error(error);
  }
}

// async function showAmountHistory(userId) {
//   const historyArray=[];
//   try {
//     // Fetch the user and their amount history records from the database
//     const userWithAmountHistory = await prisma.user.findUnique({
//       where: { id: parseInt(userId) },
//       include: {
//         amountHistory: {
          
//         },
//       },
//     });

//     if (!userWithAmountHistory) {
//       console.log(`User with ID ${userId} not found.`);
//       return;
//     }

//     // Print the amount history records for the user
//     console.log(`Amount history for User ID ${userId}:`);
//     userWithAmountHistory.amountHistory.forEach((history) => {
//       // console.log(history);
//       // console.log(`Amount: ${history.amount}`);
//       // console.log(`CreatedAt: ${history.createdAt}`);
//       // console.log(`Received Payment: ${history.receivedPayment}`);
//       // console.log(`Verify Pay: ${history.verifyPay}`);
//       // console.log('------');
//       historyArray.push(history)
      

      
//     });
//     console.log(historyArray);
//     return historyArray;
//   } catch (error) {
//     console.error('Error retrieving amount history:', error);
//   } 
// }

async function showAmountHistory(userId, page, pageSize) {
  try {
    console.log("<-----------------start------------------>");

  
    const parsedPage = parseInt(page);
    const parsedPageSize = parseInt(pageSize);

    console.log(parsedPage);

    if (isNaN(parsedPage) || isNaN(parsedPageSize)) {
      console.error("Invalid page or pageSize values. Please provide valid integers.");
      // Handle the error or return an error response to the client
      return { data: [], nextPage: null };
    }

    const skip = (parsedPage - 1) * parsedPageSize;
    const take = parsedPageSize;

    // Fetch the user and their amount history records from the database
    const userWithAmountHistory = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
      include: {
        amountHistory: {
          skip: skip,
          take: take,
          orderBy: { createdAt: "desc" }, // Order by createdAt in descending order for most recent first
        },
      },
    });

    console.log(userWithAmountHistory);
    if (!userWithAmountHistory) {
      console.log(`User with ID ${userId} not found.`);
      return { data: [], nextPage: null };
    }

    
    // Return the amount history records for the user and the nextPage value
    return {
      data: userWithAmountHistory.amountHistory,
      nextPage: parsedPage + 1,
    };
  } catch (error) {
    console.error('Error retrieving amount history:', error);
    return { data: [], nextPage: null };
  } 
}





module.exports = {
  addAmount,
  subtractAmount,
  showAmount,
  markAmountAsPaid,
  markAmountAsUnpaid,
  showPendingVerifications,
  verifyPay,
  showAmountHistory
};
