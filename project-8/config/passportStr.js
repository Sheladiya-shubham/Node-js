const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; 
const Admin = require('../models/admin.model');
const User = require('../models/user.model');



passport.use(
    new LocalStrategy(
        {usernameField: 'email', },
        async (email, password, done) => {
            let adminRec = await Admin.findOne({ email});
            let userRec = await User.findOne({ email});
            console.log("adminRec", adminRec);
            console.log("userRec", userRec);
            if (adminRec) {
                if(password == adminRec.password){
                    done(null, adminRec);
                }else{
                    done(null, false );
                }
            } else if (userRec) {
                if(password == userRec.password){
                    done(null, userRec);
                }else{
                    done(null, false );
                }
            }
            else{
                done(null, false);
            }
        }
    )
);


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    let adminRec = await Admin.findById(id);
    let userRec = await User.findById(id);
    if(adminRec){
        done(null, adminRec);
    }
    else if(userRec){
        done(null, userRec);
    }
    else{
        done(null, false);
    }
});

passport.checkAuthencicated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }else {
    res.redirect('/');
    }
}

passport.setAuthenticateUser = (req, res, next) => {
    if (req.isAuthenticated()) {
    res.locals.user = req.user;        
    }
    next();
}


module.exports = passport;