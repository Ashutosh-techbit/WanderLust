module.exports.isloggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; //originalUrl save the path user want to access after click , which redirect to login
        req.flash("error","you must be logged !!");
        return res.redirect("/login");
    }
    next();
}

//this is done bcz passport will reintialize the sessions variables , hence to get redirectUrl we save it in locals variable
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}