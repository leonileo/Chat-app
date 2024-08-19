// index.js
// Importing modules
const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const { connectDB } = require('./config/db.js')
const chatRoute = require('./routes/ChatRoute.js')
const messageRoute = require('./routes/MessageRoute.js')
const cors = require('cors')
const User = require('./models/userModel.js')


const app = express()

// middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// to serve images inside public folder
app.use(express.static('public')); 
app.use('/images', express.static('images'));

dotenv.config()
connectDB()

app.use('/chat', chatRoute)
app.use('/message', messageRoute)

app.get('/user/:id', async (req, res )=> {
    const id = req.params.id;
    
    try {
        const user = await User.findById(id);
        if (user) {    
        res.status(200).json(user);
        } else {
        res.status(404).json("No such User");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

// variables
const port = process.env.PORT

app.listen(port, () => {
    console.log(`server runnning on port ${port}`)
})