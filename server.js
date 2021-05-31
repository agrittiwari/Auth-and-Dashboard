const express = require('express');
const app = express()
const path= require('path')

const connectDB = require('./config/db')

//Connecting databse
connectDB();


//parsing data
app.use(express.json({ extended: false }))

//addressing Routes
app.use('/register', require('./Routes/User'))


app.get('/', (req, res) =>
{
    res.sendFile(path.resolve(__dirname,'index.html'))
})


const PORT = process.env.PORT || 5000
app.listen(PORT, () => { console.log(`'app listening at ${PORT}...`) })

