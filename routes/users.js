const 
express = require('express'),
Router = express.Router(),
User = require('../models/User'),
bcrypt = require('bcrypt'),
passport = require('passport'),
{ensureAuthenticated} = require('../config/auth')
;

Router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Regisztáció'
    });
})

Router.post('/register', (req, res) => {
    const {username, email, password, passwordConfirm} = req.body;
    let errors = [];
    if (!username || !email || !password || ! passwordConfirm) {
        errors.push({msg : 'Please fill in all the fields..'});
    }
    if (password != passwordConfirm) {
        errors.push({msg: 'Passwords does not match..'})
    }
    if(password.length < 6) {
        errors.push({msg: 'Password should be atlest 6 characters..'})
    }
    if (errors.length > 0) {
        res.render('register', {
            title: 'Regisztráció',
            errors,
            name: username,
            email,
            password,
            passwordConfirm
        })
    }else {
        //validation done
        const user = User.findOne({ $or : [ {email}, {name : username} ]})
            .then(user =>  {
                if (user) {
                    //user exists
                    errors.push({msg: 'This e-mail or username is already in use..'});
                    res.render('register', {
                        title: 'Regisztráció',
                        errors,
                        name: username,
                        email,
                        password,
                        passwordConfirm
                    })
                } else {
                    const newUser = new User({
                        name: username,
                        email,
                        password
                    });
                    //hash pwd
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            //Set pwd to hashed
                            newUser.password = hash;
                            //Save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in..');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        })
                    })
                }
            }); 
    }
})
Router.get('/login', (req, res) => {
    if(req.user) 
        res.redirect('/');
    else 
        res.render('login', {
            title : 'Bejelentkezés'
        });
    
})

Router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next);
})


Router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are now logged out..');
    res.redirect('/');
})

Router.get('/settings', ensureAuthenticated, (req, res) => {
    res.render('settings', {
        user: req.user,
        title: 'Beállítások'
    })
})

module.exports = Router;