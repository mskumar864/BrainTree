var express = require("express");
var bodyParser = require('body-parser');
var braintree = require("braintree");
var app = new express();
var path = require("path");
var bodyParser = require('body-parser');
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(process.env.PORT || 4000, function(){
    console.log("sd");
})




  app.get("/client_token_sb", function (req, res) {
    console.log('client_token');
    
    var gateway = braintree.connect({
      environment: braintree.Environment.Sandbox,
        accessToken: "access_token$sandbox$cmsjrxqjrjzbcz2r$3ea9b37593fb87eccaa70d92ddf6babf"
      /*  merchantId: "wmc99tkkch665f7h",
        publicKey: "k92zxzj52fsfj27m",
        privateKey: "7453bd31fb6b8dc4ea894e4d820950df"*/
          });
  
    gateway.clientToken.generate({}, function (err, response) {
      res.send(response.clientToken);
    });
  });
  
  app.post("/checkout_sb", function (req, res) {
  
    console.log("final call -----------------------------")
      var gateway = braintree.connect({
          environment: braintree.Environment.Sandbox,
      //    accessToken: "access_token$sandbox$55g8cq9ftqx5ysq5$1082e02169772c9637782fbd470d2aaa"
          accessToken : "access_token$sandbox$cmsjrxqjrjzbcz2r$3ea9b37593fb87eccaa70d92ddf6babf"
           /*  merchantId: "wmc99tkkch665f7h",
        publicKey: "k92zxzj52fsfj27m",
        privateKey: "7453bd31fb6b8dc4ea894e4d820950df"*/
        });
        //console.log('nonce from the client ----------',nonceFromTheClient);
        // Use the payment method nonce here
        
        var nonceFromTheClient = req.body.nonce;
        console.log("nonceFromTheClient"+nonceFromTheClient)
      //  console.log(req.body.amount.total);
        // Create a new transaction for $10
        var newTransaction = gateway.transaction.sale({
          amount: '10.00',
          paymentMethodNonce: nonceFromTheClient,
          merchantAccountId: "USD",
          options: {
            // This option requests the funds from the transaction
            // once it has been authorized successfully
            submitForSettlement: true,
            paypal: {
              payeeEmail: "usms1@test.com",
              supplementaryData: {
                sender_account_id: 'xyz123',
                sender_first_name:"us",
                sender_lastt_name:"test",
                sender_account_id:"219873172389",
                sender_country_code:"us",
                sender_phone:"123213213123213"
                
              
                },
            }
          }
        }, function(error, result) {
            if (result) {
              res.send(result);
            } else {
              res.status(500).send(error);
            }
        });
  
    });

  



     


module.exports = app;
