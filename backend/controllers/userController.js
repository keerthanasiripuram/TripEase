const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { Types } = require('mongoose');
const { spawn } = require('child_process');
const { translate } = require('google-translate-api-browser');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

/*custom imports*/
const userModel = require('../models/userModel')
const journalModel = require('../models/journalPost')


module.exports.signup = async (req, res, next) => {

    try {
        let registerData = JSON.parse(req.body.registerData)
        const userExists = await userModel.findOne({ email: registerData.email });
        if (userExists) {
            return res.status(200)
                .send({ message: "User already exists", success: false })
        }
        const password = registerData.password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        registerData.password = hashedPassword
        registerData.profileImage = req.file.filename
        delete registerData.confirmPassword
        const newuser = new userModel(registerData)
        await newuser.save()
        return res.status(200).send({ message: "User created successfully", success: true })
    }
    catch (error) {
        return res.status(500).send({ message: error.message, success: false, error })
    }
}


module.exports.login = async (req, res) => {
    try {
        const userExists = await userModel.findOne({ email: req.body.email });
        if (!userExists) {
            return res.status(500)
                .send({ message: "User doesn't exists", success: false })
        }
        const isMatch = await bcrypt.compare(req.body.password, userExists.password)
        console.log(req.body.password, isMatch)
        if (!isMatch) {
            return res.status(500).send({ message: "password is incorrect", success: false })
        }
        else {
            const token = jwt.sign({ id: userExists._id }, process.env.secretKey,
                {
                    expiresIn: "1d"
                })
            return res.status(200).send({ message: "login successful", success: true, token })
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ message: "Error logging user" + , success: false, error })
    }
}

module.exports.fetchUser = async (req, res, next) => {
    try {
        let userDetails = await userModel.findById(req.userId)
        return res.status(200).send({ mesaage: "User Details Fetched Successfully", success: true, data: userDetails })
    }
    catch (err) {
        return res.status(500).send({ mesaage: "Error in Fetching User Details", success: false })
    }
}

module.exports.createJournalPost = async (req, res, next) => {
    let userId = new Types.ObjectId(req.userId)
    try {
        let JournalData = {
            user: userId,
            images: req.files.map(data => data.filename),
            description: req.body.description,
        }
        // let newDocumentData = {
        //     ...DocumentData,
        //     user:userId,
        //     images: req.files.map(data => data.filename)
        // }
        const newpost = new journalModel(JournalData)
        await newpost.save()
        return res.status(200).send({ message: "Post created successfully", success: true })
    }
    catch (error) {
        return res.status(500).send({ message: error.message, success: false, error })
    }
}

module.exports.getPostData = async (req, res, next) => {
    let userId = new Types.ObjectId(req.userId)
    try {
        const postData = await journalModel.find({ user: userId })
        return res.status(200).send({ message: "Posts sent successfully", success: true, data: postData })
    }
    catch (error) {
        return res.status(500).send({ message: error.message, success: false, error })
    }
}

let map = new Map()
map.set("option1", 'en')
map.set("option2", 'kn')
map.set("option3", 'te')
map.set("option4", 'ta')
map.set("option5", 'hi')

module.exports.translateReq = async (req, res, next) => {
    if (req.body.text == '') {
        return res.status(400).send({ message: "Enter some text", success: false })
    }
    else {
        try {

            const result = await translate(req.body.text, { to: map.get(req.body.selectedOption) })
            return res.status(200).send({ message: "Text translated Successfully", success: true, data: result.text })
        }
        catch (error) {
            return res.status(500).send({ message: error.message, success: false, error })
        }
    }
}
