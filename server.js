const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env'});

const app = express();

app.get('/api/v1/bootcamps', (req, res) => {
    res.status(200).json({success: true, data: { msg: 'Show all bootcamps' }})
});

app.post('/api/v1/bootcamps', (req, res) => {
    res.status(200).json({success: true, data: { msg: 'Create new bootcamp' }})
});

app.get('/api/v1/bootcamps/:id', (req, res) => {
    res.status(200).json({success: true, data: { msg: `Get bootcamp ${req.params.id}` }})
});

app.put('/api/v1/bootcamps/:id', (req, res) => {
    res.status(200).json({success: true, data: { msg: `Update bootcamp ${req.params.id}` }})
});

app.delete('/api/v1/bootcamps/:id', (req, res) => {
    res.status(200).json({success: true, data: { msg: `Delete bootcamp ${req.params.id}` }})
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running ${process.env.NODE_ENV} ${PORT}`));