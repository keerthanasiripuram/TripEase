const exp = require("express");
const expenseApiRoute = exp.Router();
expenseApiRoute.use(exp.json())
const { Types } = require('mongoose')

/*custom imports*/
const groupModel = require('../models/groupSchema')
const userModel = require('../models/userModel')
const GroupUserExpenseModel = require('../models/GroupUserExpense')
const GroupExpenseHistoryModel = require('../models/GroupExpenseHistory')


expenseApiRoute.get("/user-groups", async (req, res, next) => {
    try {
        if (!req.userId)
            throw new Error("Invalid Request")
        let userId = new Types.ObjectId(req.userId)
        let groups = await groupModel.find({ members: userId }).lean()
        return res.status(200).send({ message: "Fetched groups", success: true, data: groups })
    }
    catch (error) {
        return res.status(500).send({ message: error.message, success: false, error })
    }
})

expenseApiRoute.get("/users", async (req, res, next) => {
    try {
        let users = await userModel.find().sort({ name: 1 }).lean()
        return res.status(200).send({ message: "Fetched groups", success: true, data: users })
    }
    catch (error) {
        return res.status(500).send({ message: error.message, success: false, error })
    }
})

expenseApiRoute.post("/user-groups", async (req, res, next) => {
    try {
        let { groupName, users } = req.body
        if (!groupName || !groupName.length || !users.length)
            throw new Error("Invalid Request")
        let userIds = users.map(data => new Types.ObjectId(data))
        let group = await groupModel.create({
            name: groupName,
            members: userIds
        })
        let bulkData = []
        for (let user of userIds) {
            let userDetails = userIds.map(data => {
                if (user.toString() !== data.toString())
                    return {
                        userId: data,
                        amount: 0
                    }
                return null
            }).filter(data => data)
            let doc = {
                user,
                group: group._id,
                userDetails
            }
            bulkData.push(doc)
        }
        await GroupUserExpenseModel.insertMany(bulkData)
        return res.status(200).send({ message: "Group Created Successfullly", success: true, data: null })
    }
    catch (error) {
        return res.status(500).send({ message: error.message, success: false, error })
    }
})

expenseApiRoute.put("/delete-group", async (req, res, next) => {
    try {
        let { group } = req.body
        if (!group)
            throw new Error("Invalid Request")
        let groupId = new Types.ObjectId(group)
        await groupModel.deleteOne({ _id: groupId })
        await GroupUserExpenseModel.deleteMany({ group: groupId })
        await GroupExpenseHistoryModel.deleteMany({ group: groupId })
        return res.status(200).send({ message: "Group Created Successfullly", success: true, data: null })
    }
    catch (error) {
        return res.status(500).send({ message: error.message, success: false, error })
    }
})

expenseApiRoute.get("/group-details", async (req, res, next) => {
    try {
        let { group } = req.query
        if (!group)
            throw new Error("Invalid Request")
        let groupId = new Types.ObjectId(group)
        let groupDetails = await GroupUserExpenseModel.find({ group: groupId }).populate("user").sort({ user: 1 }).lean()
        return res.status(200).send({ message: "Fetched groups", success: true, data: groupDetails })
    }
    catch (error) {
        return res.status(500).send({ message: error.message, success: false, error })
    }
})

expenseApiRoute.get("/group-users", async (req, res, next) => {
    try {
        let { group } = req.query
        if (!group)
            throw new Error("Invalid Request")
        let groupId = new Types.ObjectId(group)
        let userIds = await groupModel.distinct('members', { _id: groupId })
        let users = await userModel.find({ _id: { $in: userIds } }).lean()
        return res.status(200).send({ message: "Fetched groups", success: true, data: users })
    }
    catch (error) {
        return res.status(500).send({ message: error.message, success: false, error })
    }
})

expenseApiRoute.post("/add-split", async (req, res, next) => {
    try {
        let { paidBy, splitDetails, paidReason, paidAmount, group } = req.body
        if (!paidBy || !splitDetails.length || !paidReason.length || !paidAmount || !group)
            throw new Error("Invalid Request")

        splitDetails = splitDetails.map(data => {
            return {
                userId: new Types.ObjectId(data.userId),
                amount: (+data.amount)
            }
        })
        paidBy = new Types.ObjectId(paidBy)
        group = new Types.ObjectId(group)
        paidAmount = (+paidAmount)

        //Updating Group User Model
        let groupUserDocs = await GroupUserExpenseModel.find({ group }).lean()
        let groupUserDict = {}
        for (let groupUser of groupUserDocs) {
            if (!groupUserDict[groupUser.user.toString()]) {
                groupUserDict[groupUser.user.toString()] = groupUser
            }
        }

        let bulkData = []
        let paidUserDoc = groupUserDict[paidBy.toString()]

        for (let userDoc of splitDetails) {
            if (userDoc.userId.toString() === paidBy.toString())
                continue
            let groupUser = groupUserDict[userDoc.userId.toString()]
            if (!groupUser)
                throw new Error("Something went wrong")

            groupUser.balance -= userDoc.amount
            groupUser.userDetails = groupUser.userDetails.map(data => {
                if (data.userId.toString() === paidBy.toString())
                    data.amount -= userDoc.amount
                return data
            })

            paidUserDoc.balance += userDoc.amount
            paidUserDoc.userDetails = paidUserDoc.userDetails.map(data => {
                if (data.userId.toString() === userDoc.userId.toString())
                    data.amount += userDoc.amount
                return data
            })

            bulkData.push({
                updateOne: {
                    filter: { _id: groupUser._id },
                    update: {
                        $set: {
                            user: groupUser.user,
                            group: groupUser.group,
                            balance: groupUser.balance,
                            userDetails: groupUser.userDetails,
                        }
                    }
                }
            })
        }

        bulkData.push({
            updateOne: {
                filter: { _id: paidUserDoc._id },
                update: {
                    $set: {
                        user: paidUserDoc.user,
                        group: paidUserDoc.group,
                        balance: paidUserDoc.balance,
                        userDetails: paidUserDoc.userDetails,
                    }
                }
            }
        })

        if (bulkData.length)
            await GroupUserExpenseModel.bulkWrite(bulkData)

        //Updating HistoryDoc
        let historyDoc = {
            group: group,
            paidBy: paidBy,
            amount: paidAmount,
            reason: paidReason,
            paymentDetails: splitDetails
        }
        await GroupExpenseHistoryModel.create(historyDoc)

        return res.status(200).send({ message: "Group Created Successfullly", success: true, data: null })
    }
    catch (error) {
        return res.status(500).send({ message: error.message, success: false, error })
    }
})

expenseApiRoute.get("/history-data", async (req, res, next) => {
    try {
        let { group } = req.query
        if (!group)
            throw new Error("Invalid Request")
        let groupId = new Types.ObjectId(group)
        let historyData = await GroupExpenseHistoryModel.find({ group: groupId }).populate('paidBy').sort({ createdAt: 1 }).lean()
        return res.status(200).send({ message: "Fetched groups", success: true, data: historyData })
    }
    catch (error) {
        return res.status(500).send({ message: error.message, success: false, error })
    }
})

expenseApiRoute.get("/history-data", async (req, res, next) => {
    try {
        let { group } = req.query
        if (!group)
            throw new Error("Invalid Request")
        let groupId = new Types.ObjectId(group)
        let historyData = await GroupExpenseHistoryModel.find({ group: groupId }).populate('paidBy').sort({ createdAt: -1 }).lean()
        return res.status(200).send({ message: "Fetched groups", success: true, data: historyData })
    }
    catch (error) {
        return res.status(500).send({ message: error.message, success: false, error })
    }
})

expenseApiRoute.get("/user-totals", async (req, res, next) => {
    try {
        let { group } = req.query
        if (!group || !req.userId)
            throw new Error("Invalid Request")
        let userId = new Types.ObjectId(req.userId)
        let groupId = new Types.ObjectId(group)
        let userDoc = await GroupUserExpenseModel.findOne({ group: groupId, user: userId }).lean()
        let returnValue = {
            balance: 0,
            owe: 0,
            owed: 0
        }
        if (!userDoc)
            return returnValue
        returnValue.balance = userDoc.balance
        for (let userDetail of userDoc.userDetails) {
            if (userDetail.amount >= 0)
                returnValue.owed += userDetail.amount
            else
                returnValue.owe += Math.abs(userDetail.amount)
        }
        return res.status(200).send({ message: "Fetched groups", success: true, data: returnValue })
    }
    catch (error) {
        return res.status(500).send({ message: error.message, success: false, error })
    }
})


module.exports = expenseApiRoute;