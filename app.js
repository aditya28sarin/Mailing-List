const express= require('express');

const app=express();

const bodyParser=require('body-parser');

const https= require("https");

app.use(bodyParser.urlencoded({extended:true}));

//created to serve static files such as css file and images, that wont be accesible if we save on just home directory 
app.use(express.static("public"));



app.get("/", function(req,res){

    res.sendFile(__dirname+"/signup.html");

});


app.post("/",function(req,res){

    const firstName=req.body.firstName;
    const lastName=req.body.lastName;
    const email=req.body.email;

//creating a JS obj of what Mailchimp needs to create a subscriber 
    const data ={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName,
                }
            }
        ]
    };

    const jsonData= JSON.stringify(data);


    //earlier we use https.get() but that only make get requests, when we want data from a resource, but here we want to send data 
    //so we will use https.request() where we can specify the type of request, either get or post, here it is post. 

    const url = "https://us7.api.mailchimp.com/3.0/lists/69b6d1b852";

    const options ={
        method: "POST",
        auth: "aditya:02d29cbcf34b20989a7443caabd75412-us7"
    };
    const request= https.request(url,options, function(response){

        if(response.statusCode===200)
        {
            res.sendFile(__dirname+"/success.html");
        }
        else
        {
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req,res){
    res.redirect("/");
});

//this is for a dynamic port so that it aligns with the port heroku servers would assign or also listen on 3000 when run locally
app.listen(process.env.PORT || 3000,function(){

    console.log('Server is listening at Port 3000..')
});



// 02d29cbcf34b20989a7443caabd75412-us7


// 69b6d1b852