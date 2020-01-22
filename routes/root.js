const 
express = require('express'),
Router = express.Router(),
User = require('../models/User'),
bcrypt = require('bcrypt'),
passport = require('passport'),
{ensureAuthenticated} = require('../config/auth')
;

Router.get('/', (req, res) => {
    res.render('home', {
        title: 'Kezdőlap',
        user: req.user
    })
 
})






module.exports = Router;