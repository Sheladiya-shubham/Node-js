const Admin = require("../models/admin.model")
const sendMail = require("../config/mailConfig");


exports.logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return  false;
    }
    else{
        return res.redirect("/");
    }
})
}


exports.loginPage = async (req, res) => {
    if(req.isAuthenticated && req.isAuthenticated()){
        return res.redirect("/dashboard")
    }else{
        return res.render('login')
    }
}
exports.dashBoard = async (req, res) => {
    return res.render('dashboard')
}

exports.loginAdmin = async (req, res) => {
   try{
    req.flash("success", "Admin Pannel Me Apka Swagat Hai....");
    return res.redirect("/dashboard")
   }catch(error){
    return res.redirect("back")
}

}


exports.forgotPasswordPage = (req, res) => {
    try {
        return res.render('forgotPassword/forgotpassword');
    } catch (error) {
        console.log(error);
        return res.redirect("back");
    }
};

exports.sendEmail = async (req, res) => {
    try {
        console.log("✅ sendEmail function called!");
        console.log("Received Data:", req.body);

        let admin = await Admin.findOne({ email: req.body.email });
        if (admin) {
            let otp = Math.floor(Math.random() * 1000000);
            await sendMail(req.body.email, otp); // ✅ Now it works!

            res.cookie("email", req.body.email);
            res.cookie("otp", otp);

            console.log("✅ Redirecting to OTP Page...");
            return res.render("forgotPassword/otp");
        } else {
            console.log("❌ Admin not found!!!!!");
            return res.redirect("back");
        }
    } catch (error) {
        console.log("❌ Error in sendEmail:", error);
        return res.redirect("back");
    }
};



exports.verifyOTP = async (req, res) => {
    try {
        // console.log(req.body);
        // console.log(req.cookies.otp)
        let otp = req.cookies.otp;

        if(otp == req.body.otp){
            return res.render('forgotPassword/newPassword')
        }else{
            console.log("OTP Mismatched....");
            return res.redirect("back");
        }
    } catch (error) {
        console.log(error);
        return res.redirect("back");
    }
};

// Profile Page
exports.profilePage = async (req, res) => {
    console.log("🔍 Checking Admin Session:", req.user); // Debugging

    if (!req.isAuthenticated() || !req.user) {
        console.log("❌ User not authenticated. Redirecting...");
        return res.redirect("/");
    }

    let admin = req.user; // ✅ Passport automatically provides admin data
    console.log("✅ Admin found:", admin);

    let imagePath = admin.image || "/uploads/default-profile.png";
    return res.render("profile", { admin, imagePath });
};






exports.resetPassword = async (req, res) => {
    try {
        // console.log(req.body);
        let password = req.body.password;
        let cPass = req.body.c_password;
        let email = req.cookies.email;

        if(password == cPass){
            let admin = await Admin.findOne({email: email});
            if(admin){
                await Admin.findOneAndUpdate({email: email}, req.body, {new: true});
                console.log("password Update");
                res.clearCookie("email");
                res.clearCookie("otp");
                return res.redirect("/")
            }else{
                console.log("Admin not found");
                return res.redirect("/");
            }
        }else{
            console.log("Password & Confirm password is not matched....");
            return res.redirect("back");
        }
    } catch (error) {
        console.log(error);
        return res.redirect("back");
    }
}

exports.changePasswordPage = async (req, res) => {
   try {
       return res.render("changePassword")
   } catch (error) {
       console.log(error);
       return res.redirect("back");
   }
}

exports.changePassword = async (req, res) => {
   try {
       const {newpass, currentPass, confpass} = req.body;
       const user = req.user;

       if(currentPass == user.password){
           if(currentPass != newpass){
               if(newpass == confpass){
                   await Admin.findByIdAndUpdate(user._id, {password: newpass}, {new: true});
                   console.log("Password was Changed Success....");
                   return res.redirect("/dashboard")
               }else{
                   console.log("New password and Confirm password is not matched!!!!");
                   return res.redirect("back");
               }

           }else{
               console.log("Current password and New password is Same!!!!");
               return res.redirect("back");
           }
       }else{
           console.log("Current password and user password is not matched!!!!");
           return res.redirect("back");
       }
   } catch (error) {
       console.log(error);
       return res.redirect("back");
   }
}


