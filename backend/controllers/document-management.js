const exp = require("express");
const docApiRoute = exp.Router();
docApiRoute.use(exp.json())
const multer = require('multer');
const { Types } = require('mongoose')
const twilio = require('twilio');
const twilioClient = twilio(process.env.twilio_userid, process.env.twilio_password);

/*custom imports*/
const DocumentModel = require('../models/DocumentsSchema')
const userModel = require('../models/userModel')

//dot env setup
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

//multer uploads
const DocumentStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = path.join(__dirname, "../" + process.env.PROFILE_IMAGE_DOCUMENT_UPLOAD_PATH)
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        let filename = new Date().getTime().toString() + file.originalname
        cb(null, filename);
    }
});
const DocumentUpload = multer({ storage: DocumentStorage });

docApiRoute.post('/request-OTP', async (req, res) => {
    const { phoneNumber } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    try {
        const user = await userModel.findOneAndUpdate({ phoneNumber: phoneNumber }, {
            otp,
            otpExpiration: Date.now() + 1 * 60 * 1000 // OTP expires in 1 minutes
        });

        // Send OTP via SMS using Twilio
        await twilioClient.messages.create({
            body: `Your OTP for Travel Document Management: ${otp}`,
            to: phoneNumber,
            from: '+13133492156'
        });

        res.status(200).send('OTP sent successfully!');
    } catch (error) {
        res.status(500).send('Failed to send OTP');
    }
}
)

docApiRoute.post('/uploadDoc', DocumentUpload.array('images'), async (req, res, next) => {
    try {
        let userId = new Types.ObjectId(req.userId)
        const userFound = await DocumentModel.findOne({ user: userId })
        if (!userFound) {
            let DocumentData = {
                user: userId,
                images: req.files.map(data => data.filename)
            }
            const newDocument = new DocumentModel(DocumentData)
            await newDocument.save()
            return res.status(200).send({ message: "Documents stored  successfully", success: true })
        }
        else {
            userFound.images.push(...req.files.map(data => data.filename))
            await userFound.save();

            return res.status(200).send({ message: "Documents stored  successfully", success: true })
        }
    }
    catch (error) {
        return res.status(500).send({ message: error.message, success: false, error })
    }
})

docApiRoute.post('/checkValidity', async (req, res, next) => {
    try {
        let userId = new Types.ObjectId(req.userId)
        const otp = await userModel.findById(userId)
        
        if (otp && otp.otp === req.body.otp) {
            const documents = await DocumentModel.findOne({ user: userId }).lean()
            return res.status(200).send({ message: "Documents fetched successfully", success: true, data: documents ? documents.images : [] })
        }
        else {
            return res.status(200).send({ message: "Enter correct OTP", success: false })
        }

    }
    catch (error) {
        return res.status(500).send({ message: error.message, success: false, error })
    }
})

module.exports = docApiRoute;

