const exp = require("express");
const tripApiRoute = exp.Router();
tripApiRoute.use(exp.json())
const { Types } = require('mongoose')

const ExpenseListSchema = require('../models/ExpenseSchema')


tripApiRoute.post('/expenseData', async (req, res, next) => {

    try {
        let userId = new Types.ObjectId(req.userId)
        const foundExpense = await ExpenseListSchema.findOne({ user: userId, budgetName: req.body.budgetNameForExpense })
        if (foundExpense) {
            foundExpense.expenseList.push(req.body.expenses);
            let expenseAmount = +req.body.expenses.expenseAmount
            foundExpense.totalAmount += expenseAmount
            const updatedExpense = await foundExpense.save();
            return res.status(200).send({ message: "Expenses addedd successfully", success: true })
        } else {
            return res.status(200).send({ message: "Document not found create budgetname ", success: true })
        }

    }
    catch (error) {
        return res.status(500).send({ message: error.message, success: false, error })
    }
})

tripApiRoute.post('/addTripName', async (req, res, next) => {
    let userId = new Types.ObjectId(req.userId)
    const { tripname } = req.body;
    try {
        let TripNameData = {
            user: userId,
            budgetName: tripname
        }
        const newTripName = new ExpenseListSchema(TripNameData)
        await newTripName.save()
        return res.status(200).send({ message: "Trip Name stored successfully", success: true })
    }
    catch (error) {
        return res.status(500).send({ message: error.message, success: false, error })
    }
})

tripApiRoute.post('/displayExpenses', async (req, res, next) => {
    try {
        let userId = new Types.ObjectId(req.userId)
        const ExpenseData = await ExpenseListSchema.find({ user: userId, budgetName: req.body.selectedTripName })
        return res.status(200).send({ message: "Expense data fetched successfully", success: true, data: ExpenseData[0].expenseList })
    }
    catch (error) {
        return res.status(500).send({ message: error.message, success: false, error })
    }
})

tripApiRoute.get('/displayTripList', async (req, res, next) => {
    let userId = new Types.ObjectId(req.userId)
    try {
        const tripNames = await ExpenseListSchema.aggregate([
            //stage1
            {
                $match: {
                    user: userId
                }
            },
            //stage 2
            {
                $project: {
                    budgetName: 1
                }
            }
        ]

        )
        return res.status(200).send({ message: "Expense data fetched successfully", success: true, data: tripNames })
    }
    catch (error) {
        return res.status(500).send({ message: error.message, success: false, error })
    }
})

tripApiRoute.post('/displaySelectedTripData', async (req, res, next) => {

    try {
        let userId = new Types.ObjectId(req.userId)
        const ExpenseData = await ExpenseListSchema.find({ user: userId })
        return res.status(200).send({ message: "Trips fetched successfully", data: ExpenseData, success: true })
    }
    catch (error) {
        return res.status(500).send({ message: error.message, success: false, error })
    }
})


module.exports = tripApiRoute