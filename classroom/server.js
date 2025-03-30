const express = require("express")
const app = express();
const users = require("./routes/users")
const posts = require("./routes/posts")
const cookieparser = require("cookie-parser")
const session  = require("express-session")
const flash = require("connect-flash")
const path = require("path")


// ================ Session =============================

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))

const sessionoptions  = {secret:"mysupersecretstring",resave:false , saveUninitialized:true};

app.use(session(sessionoptions)); //using session as middleware , it creates a session cookie which is saved in the user's browser and contains a unique session identifier that links back to the actual session data stored on the server.
app.use(flash());

app.get("/register",(req,res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    req.flash("success","user successfully registered!!"); //key , pair
    res.redirect("/hello")
})

app.get("/hello",(req,res)=>{
    // res.send(`hello, ${req.session.name}`)

    // res.render("page.ejs",{name:req.session.name,msg:req.flash("success")})

    res.locals.msg = req.flash("success"); //used when a vaiable is need to send to views with render ~
    res.render("page.ejs",{name:req.session.name})

})


app.get("/test",(req,res)=>{
    res.send("test done!!")
})

//req.session.count take count of number of requests -> ye count same browser pr tab open krne se count add honge naaki 1 se start honge 
// this stores in temproary memory
app.get("/response",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
    res.send(`you send ${req.session.count} requests`);
})



// ==========COOKIES=====================

// app.use(cookieparser("secret"));

// app.get("/getsignedcookies",(req,res)=>{
//     res.cookie("color","red",{signed:true});
//     res.send("signed cookie sent")
// })

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// })

// app.get("/getcookies",(req,res)=>{
//     res.cookie("name","ashu");
//     res.cookie("age","19");
//     res.send("Check your baked cookies :)");
// })

// app.get("/",(req,res)=>{
//     console.log(req.cookies);
//     res.send("Hi i am root");
// })



// app.get("/greet",(req,res)=>{
//     let {name = "anonymous"} = req.cookies;
//     res.send(`hi ${name}`)
// })

// app.use("/users",users);
// app.use("/posts",posts);

app.listen(3030,()=>{
    console.log("server started at 3030");
})