const http = require('http');

const fs = require('fs');

const requesthandeler = (req,res)=> {
    // console.log(req.url);
    let filename =""
    switch(req.url){
        case "/":
            filename="./home.html";
            break;
        
        case "/about":
            filename="./about.html";
            break;
        
        case "/contact":
            filename="./contact.html";
            break;
            
            default:
                filename = "./404.html";
    }
    fs.readFile(filename,(err,result)=>{
        if(err){
            // res.writeHead(500, { "Content-Type": "text/plain" });
            return res.end("Internal Server Error");
        }
        else{
            // res.writeHead(200, { "Content-Type": "text/html" });
            res.end(result);
        }
    })
}

const server = http.createServer(requesthandeler);

server.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});