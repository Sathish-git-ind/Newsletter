const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

var app = express();
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.listen(process.env.PORT || 3000, function() {
  console.log("App listening on port 3000");
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  var firstName = req.body.fname;
  var lastName = req.body.lname;
  var email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  }

  const jsonData = JSON.stringify(data);

  const listId = "2ee03278af";
  const url = "https://us1.api.mailchimp.com/3.0/lists/" + listId;
  const options = {
    method: "POST",
    auth: "sathish0987:7a532f6d54ab25a91ded47f0b60b031a-us1"
  }

  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html");
    }

  })

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req,res){
  res.redirect("/");
})

// API key
//7a532f6d54ab25a91ded47f0b60b031a-us1

//Unique key
//2ee03278af
