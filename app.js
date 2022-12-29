const { json } = require('body-parser');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 7777;
const https = require('https');
const { url } = require('inspector');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.listen(process.env.PORT || port, () => console.log(`Server is running at port ${port}`));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
})

app.post('/', (req, res) => {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;

    const mailChimpSubscriberUrl = 'https://us10.api.mailchimp.com/3.0/lists/1f013e7f08';
    const APIKEY = '1f013e7f08';
    const data = JSON.stringify({
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
            }
        }]
    });

    const options = { method: "POST", auth: "kartik:954ee6aa38b2c39b37153c6381cf3558-us1" };
    const mcRequest = https.request(mailChimpSubscriberUrl, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on('data', data => console.log(JSON.parse(data)));
    });
    mcRequest.write(data);
    mcRequest.end();

});

app.get('/try-again', (req, res) => res.redirect('/'));