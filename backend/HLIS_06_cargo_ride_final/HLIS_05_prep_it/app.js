const express = require('express');
const app_routing = require('./modules/app-routing');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');  
app.set('views', path.join(__dirname, 'views'));

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
app.use(bodyParser.urlencoded({ extended: true }));
const validator = require("./middleware/validators");
const headerAuth = require("./middleware/header-auth");

app.use(validator.extractHeaderLanguage);
app.use(headerAuth.validateApiKey);
// app.use(headerAuth.header)

app_routing.v1(app); //router v1 ko call karega 


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port,()=>{
    console.log(`Server is running on port:${port}`);
})

