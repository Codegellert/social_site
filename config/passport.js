const LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    User = require('../models/User');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, ( email, password, done ) => {
            // Match user via email
            User.findOne({email})
                .then(user => {
                    if (!user) {
                        
                        return done( null, false, { message: 'That email is not registered..'});
                    }
                    //match the password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;
                        if (isMatch) {
                            //If the pw and UI is correct..
                            return done(null, user)
                        }else{
                            return done(null, false, {message: 'Password is incorrect..'})
                        }
                    });
                })
                .catch(err => console.log(err))
        })
    )

    passport.serializeUser( (user, done) => {
        done(null, user.id);
    });
      
    passport.deserializeUser((id, done) => {
        User.findById(id, (error, user) => {
            done(error, user);
        });
    });

}