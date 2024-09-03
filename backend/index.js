const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer');
const app = express()

/*Custom imports*/
const db = require('./db')
const authMiddleware = require('./authMiddleware')
const userController = require('./controllers/userController')
const verifyToken = require("./middlewares/token-verification")

/*dot env setup*/
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

/*Middlewares for server*/
app.use(bodyParser.json())
app.use(express.json());
app.use(cors())
app.use('/TripEase/backend/uploadJournal', express.static(path.join(__dirname, process.env.PROFILE_IMAGE_JOURNAL_UPLOAD_PATH)));
app.use('/TripEase/backend/uploads', express.static('D:/TripEase/backend/uploads'));
app.use('/TripEase/backend/uploadDocuments', express.static(path.join(__dirname, process.env.PROFILE_IMAGE_DOCUMENT_UPLOAD_PATH)));

/*Multer Code for image Uploading*/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = path.join(__dirname, process.env.PROFILE_IMAGE_UPLOAD_PATH)
        cb(null, uploadPath); 
    },
    filename: function (req, file, cb) {
        let filename = new Date().getTime().toString() + file.originalname
        cb(null, filename);
    }
});
const upload = multer({ storage: storage });

/*Multer Code for image Uploading*/
const journalStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = path.join(__dirname, process.env.PROFILE_IMAGE_JOURNAL_UPLOAD_PATH)
        cb(null, uploadPath); 
    },
    filename: function (req, file, cb) {
        let filename = new Date().getTime().toString() + file.originalname
        cb(null, filename);
    }
});
const journalUpload = multer({ storage: journalStorage });


/****End Points****/

/*User Controller Routes*/
app.post('/register', upload.single('image'), userController.signup)
app.post('/login', userController.login)
app.get('/fetchUser',verifyToken,userController.fetchUser)
app.post('/journalData', verifyToken, journalUpload.array('images'), userController.createJournalPost)
app.get('/get-post-data', verifyToken, userController.getPostData)
app.post('/translateReq', verifyToken, userController.translateReq)

/*Python Routes*/
const pythonApiRoute = require('./controllers/python-controller')
app.use('/pyt-routes', verifyToken, pythonApiRoute)

/*Expense Management Routes*/
const expenseApiRoute = require("./controllers/expense-management");
app.use("/expense-management", verifyToken, expenseApiRoute);

/*Document routes*/
const docApiRoute = require('./controllers/document-management')
app.use("/doc-management",verifyToken,docApiRoute)

/*Trip Management*/
const tripApiRoute =  require('./controllers/trip-management')
app.use("/trip-management",verifyToken,tripApiRoute)


/*Global Error Handler*/
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

/*Server Connection*/
const port = process.env.PORT
app.listen(port, () => {
    console.log(`running on ${port}`)
})

