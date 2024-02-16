const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost:27017/AuctionHouse';

module.exports = async (app) => {
    try {
        await mongoose.connect(connectionString, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });

        console.log('Database conected');

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}