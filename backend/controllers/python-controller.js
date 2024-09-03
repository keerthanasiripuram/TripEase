const { spawn } = require('child_process');
const exp = require("express");
const pythonApiRoute = exp.Router();
pythonApiRoute.use(exp.json())
const { Types } = require('mongoose')
const path = require('path');

//fun to call hotel recommmendation python script
pythonApiRoute.post('/hotel-recommendations',async(req, res, next) => {
    const destination = req.body.destination;
    const checkIn = req.body.checkIn;
    const checkOut = req.body.checkOut;
    const rating = req.body.rating;
    const price = req.body.value;
    const alcohol = req.body.checked;
    let hoteldata = []
    try {
        // Path to the Python script
        const pythonScriptPathString = '../hotels.py';
        let pythonScriptPath = path.join(__dirname, pythonScriptPathString)

        // Path to the CSV file
        let  csvFilePathString = '../csv_data.csv';
        let csvFilePath = path.join(__dirname, csvFilePathString)

        // Spawn Python process with the Python script path and CSV file path as arguments
        const pythonProcess = spawn('python', [pythonScriptPath, csvFilePath, destination, checkIn, checkOut, price, rating, alcohol]);
        pythonProcess.stdout.on('data', (data) => {

            console.log(`Python script stdout: ${data}`);
            hoteldata = data
        });


        pythonProcess.on('error', (error) => {
            console.error(`Error executing Python script: ${error}`);
        });


        pythonProcess.on('exit', (code) => {
            console.log(`Python script exited with code ${code}`);
            res.status(200).json({ message: "Fetched hotels data", success: true, data: hoteldata });
        });
    } catch (error) {
        console.error(`Error executing Python scripts: ${error}`);
        res.status(500).json({ message: 'Error executing Python scripts', success: false });
    }
} )

//fun to call Vaction recommmendation python script
pythonApiRoute.post('/places-recommendation', async (req, res, next) => {
    let placesdata = ''
    try {

        const pythonScriptPathString = '../places.py';
        let pythonScriptPath = path.join(__dirname, pythonScriptPathString)

        let  csvFilePathString = '../Top Indian Places to Visit.csv';
        let csvFilePath = path.join(__dirname, csvFilePathString)
        
        const spot = req.body.selectedFeature
        // Spawn Python process with the Python script path and CSV file path as arguments
        const pythonProcess = await spawn('python', [pythonScriptPath, csvFilePath, spot]);
        await pythonProcess.stdout.on('data', async(data) => {

            console.log(`Python script stdout: ${data}`);
            placesdata = data
        });

        await pythonProcess.on('error', (error) => {
            console.error(`Error executing Python script: ${error}`);
        });


        await pythonProcess.on('exit', (code) => {
            console.log(`Python script exited with code ${code}`);
            res.status(200).json({ message: "Fetched hotels data", success: true, data: placesdata });
        });


    } catch (error) {
        console.error(`Error executing Python scripts: ${error}`);
        res.status(500).json({ message: 'Error executing Python scripts', success: false });
    }
})

module.exports=pythonApiRoute