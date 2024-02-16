const express = require('express');
const configExpress = require('./config/express');
const configDatabase = require('./config/database');
const configRoutes = require('./config/routes');
start()

async function start(){
    const app = express();

    configExpress(app);
    
    await configDatabase(app);

    configRoutes(app);

    app.listen(3000, () => console.log('app listening...'))
}