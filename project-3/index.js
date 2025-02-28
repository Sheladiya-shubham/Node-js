const express = require("express");
const port = 8015;
const path = require("path");
const server = express();

server.use(express.urlencoded());
server.set("view engine", "ejs");

server.use("/",express.static(path.join(__dirname,"public")));

server.get("/accordion",(req,res)=>{
    res.render('accordion')
});
server.get("/auth-normal-sign-in",(req,res)=>{
    res.render('auth-normal-sign-in')
});
server.get("/auth-sign-up",(req,res)=>{
    res.render('auth-sign-up')
});
server.get("/breadcrumb",(req,res)=>{
    res.render('breadcrumb')
})
server.get("/bs-basic-table",(req,res)=>{
    res.render('bs-basic-table')
})
server.get("/button",(req,res)=>{
    res.render('button')
})
server.get("/chart",(req,res)=>{
    res.render('chart')
})
server.get("/color",(req,res)=>{
    res.render('color')
});
server.get("/form-elements-component",(req,res)=>{
    res.render('form-elements-component')
});
server.get("/icon-themify",(req,res)=>{
    res.render('icon-themify')
});
server.get("/",(req,res)=>{
    res.render('index')
})
server.get("/label-badge",(req,res)=>{
    res.render('label-badge')
})
server.get("/map-google",(req,res)=>{
    res.render('map-google')
})
server.get("/notification",(req,res)=>{
    res.render('notification')
})
server.get("/progress-bar",(req,res)=>{
    res.render('progress-bar')
});
server.get("/sample-page",(req,res)=>{
    res.render('sample-page')
})
server.get("/tabs",(req,res)=>{
    res.render('tabs')
})
server.get("/tooltip",(req,res)=>{
    res.render('tooltip')
})
server.get("/typography",(req,res)=>{
    res.render('typography')
})

server.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server started at http://localhost:${port}`);
    }
});