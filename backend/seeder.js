const mongoose = require("mongoose");
const dotenv = require('dotenv');

const users = require('./data/users.js');
const {connectDB} = require('./config/db.js');
const User = require('./models/userModel.js')

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();

        const createdUsers = await User.insertMany(users);

        console.log('Data imported')
        process.exit(1);
    } catch (error) {
        console.log(`${error}`);
        process.exit(1);
    }
}

const destroyData = async () => {
    try {
        await User.deleteMany();
        console.log('Data destroyed'.red.inverse);
        process.exit(1);
    } catch (error) {
        console.log(`${error}`.red.inverse);
        process.exit(1);
    }
}
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}