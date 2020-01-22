const 
express = require('express'),
Router = express.Router(),
User = require('../models/User'),
bcrypt = require('bcrypt'),
passport = require('passport'),
{ensureAuthenticated} = require('../config/auth')
;


Router.get('/:name',ensureAuthenticated, async(req, res) => {
    const profile = await User.findOne({name: req.params.name});
    if (profile) {
        res.render('profile', {
            profile
        })
    }else {
        req.flash('error_msg', 'No profile like that');
        res.redirect('/');
    }
    

    
})



module.exports = Router;