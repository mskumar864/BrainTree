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


app.get("/client_token", function (req, res) {
  console.log('client_token');
  
  var gateway = braintree.connect({
    environment: braintree.Environment.Production,
//    accessToken: "access_token$sandbox$55g8cq9ftqx5ysq5$1082e02169772c9637782fbd470d2aaa"
    accessToken : "access_token$production$96vrdvzcgbzj475g$012a9b891176afc4ea1aeba77bf53d93"
});

  gateway.clientToken.generate({}, function (err, response) {
    res.send(response.clientToken);
  });
});

app.post("/checkout", function (req, res) {
    var gateway = braintree.connect({
        environment: braintree.Environment.Production,
    //    accessToken: "access_token$sandbox$55g8cq9ftqx5ysq5$1082e02169772c9637782fbd470d2aaa"
        accessToken : "access_token$production$96vrdvzcgbzj475g$012a9b891176afc4ea1aeba77bf53d93"
    });
   
      // Use the payment method nonce here
      var nonceFromTheClient = req.body.nonce;
      console.log(nonceFromTheClient)
      // Create a new transaction for $10
      var newTransaction = gateway.transaction.sale({
        amount: req.body.amount,
        paymentMethodNonce: nonceFromTheClient,
        merchantAccountId: "EUR",
        options: {
          // This option requests the funds from the transaction
          // once it has been authorized successfully
          submitForSettlement: true
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
