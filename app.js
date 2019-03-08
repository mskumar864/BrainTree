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

  console.log("final call -----------------------------")
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
          submitForSettlement: true,
          paypal:{
            description: "shirt pepe",
            customField:"myrefercen"
          }

        },
        orderId:"1234324324",
        channel:"partner_sea"
      }, function(error, result) {
          if (result) {
            res.send(result);
          } else {
            res.status(500).send(error);
          }
      });

  });


  app.get("/client_token_sb", function (req, res) {
    console.log('client_token');
    
    var gateway = braintree.connect({
      environment: braintree.Environment.Sandbox,
        accessToken: "access_token$sandbox$cmsjrxqjrjzbcz2r$3ea9b37593fb87eccaa70d92ddf6babf"
      //accessToken : "access_token$production$96vrdvzcgbzj475g$012a9b891176afc4ea1aeba77bf53d93"
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
      });
        //console.log('nonce from the client ----------',nonceFromTheClient);
        // Use the payment method nonce here

        console.log("req.body"+JSON.stringify(jreq.body));
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

    app.post("/vault", function (req, res) {
      console.log('vault');
        console.log(req.body.nonce);
        var gateway = braintree.connect({
          environment: braintree.Environment.Sandbox,
      //    accessToken: "access_token$sandbox$55g8cq9ftqx5ysq5$1082e02169772c9637782fbd470d2aaa"
          accessToken : "access_token$sandbox$cmsjrxqjrjzbcz2r$3ea9b37593fb87eccaa70d92ddf6babf"
      });
        var fulldata = req.body.fulldata?req.body.fulldata:"minimal";
        gateway.customer.create({
          firstName: "Suresh",
          lastName: "Kumar",
          paymentMethodNonce: req.body.nonce
        }, function (err, result) {
          if (err) {
            res.status(500);
            console.log(err);
            res.send(err.message);
          } else if (result.success) {
            console.log(result);
            if(fulldata === "all"){
              res.send(result);
            }else {
              res.send({
                success : result.success,
                customerId: result.customer.paymentMethods[0].customerId,
                token : result.customer.paymentMethods[0].token,
                payerEmail: result.customer.paymentMethods[0].email,
                billingAgreementId: result.customer.paymentMethods[0].billingAgreementId              
              });
            }         
          } else {
            console.log(result);
            res.status(500);
            res.send("Error:  " + result.message);
          }
        });
  });  
  
  app.post("/vaultwithpayment", function (req, res) {
    console.log('vault with payment');
      var nonce = req.body.nonce;
      var fulldata = req.body.fulldata?req.body.fulldata:"minimal";
      console.log(nonce);
      var gateway = braintree.connect({
        environment: braintree.Environment.Sandbox,
    //    accessToken: "access_token$sandbox$55g8cq9ftqx5ysq5$1082e02169772c9637782fbd470d2aaa"
        accessToken : "access_token$sandbox$cmsjrxqjrjzbcz2r$3ea9b37593fb87eccaa70d92ddf6babf"
    });
      var saleRequest = {
         amount: req.body.amount?req.body.amount:"1.00",
         merchantAccountId: req.body.currency?req.body.currency:"USD",
         paymentMethodNonce: nonce,
         // orderId : req.body.invoice_id,
          options: {
            submitForSettlement: true,
            storeInVault: true 
          },
          // customer : {
          //   firstName :"Reena",
          //   lastName : "kumari",
          //   company : 'PayPal',
          //   'phone': '123123123',
          //   'website': 'http://www.example.com',
          //   'email':'some@testbt.com'
          // },
            "deviceData":req.device_data
        };
        gateway.transaction.sale(saleRequest, function (err, result) {
          if (err) {
            res.status(500);
            console.log(err);
            res.send(err.message);
          } else if (result.success) {
            console.log(result);
            if(fulldata === "all"){
              res.send(result);
            }else {
              res.send({
                success : result.success,
                id : result.transaction.id,
                orderId: result.transaction.orderId,
                amount: result.transaction.amount,
                currency: result.transaction.merchantAccountId,
                customerId: result.transaction.customer.id,
                token : result.transaction.paypal.token,
                payerEmail: result.transaction.paypal.payerEmail,             
              });
            }      
          } else {
            console.log(result);
            res.status(500);
            res.send("Error:  " + result.message);
          }
        });
  });
  
  app.get("/autopay", function (req, res) {
    console.log('autopay');
      console.log(req.query.amount);
      console.log(req.query.rt_token);
      console.log(req.query.currency);
      var fulldata = req.query.fulldata?req.query.fulldata:"minimal";
      var gateway = braintree.connect({
        environment: braintree.Environment.Sandbox,
    //    accessToken: "access_token$sandbox$55g8cq9ftqx5ysq5$1082e02169772c9637782fbd470d2aaa"
        accessToken : "access_token$sandbox$cmsjrxqjrjzbcz2r$3ea9b37593fb87eccaa70d92ddf6babf"
    });

      var saleRequest = {
          amount: req.query.amount,
          merchantAccountId: req.query.currency?req.query.currency:"USD",
          paymentMethodToken: req.query.rt_token,
         // orderId : req.body.invoice_id,
          options: {
            submitForSettlement: true
          }
        };
        gateway.transaction.sale(saleRequest, function (err, result) {
          if (err) {
            res.status(500);
            console.log(err);
            res.send(err.message);
          } else if (result.success) {
            console.log(result);
            console.log('payment sucess with result.transaction.id'+ result.transaction.id);
            if(fulldata === "all"){
              res.send(result);
            }else {
              res.send({
                success : result.success,
                id : result.transaction.id,
                orderId: result.transaction.orderId,
                amount: result.transaction.amount,
                currency: result.transaction.merchantAccountId,
                customerId: result.transaction.customer.id,
                token : result.transaction.paypal.token,
                payerEmail: result.transaction.paypal.payerEmail, 
                paymentId: result.transaction.paypal.paymentId            
              });
            } 
          } else {
            console.log(result);
            res.status(500);          
            res.send("Error:  " + result.message);
          }
        });
  });
  

    app.get("/client_token_sb_bt", function (req, res) {
      console.log('client_token');
      
      var gateway = braintree.connect({
        environment: braintree.Environment.Sandbox,
         // accessToken: "access_token$sandbox$cmsjrxqjrjzbcz2r$3ea9b37593fb87eccaa70d92ddf6babf"
         merchantId: "wmc99tkkch665f7h",
         publicKey: "k92zxzj52fsfj27m",
         privateKey: "7453bd31fb6b8dc4ea894e4d820950df"
            });
    
      gateway.clientToken.generate({}, function (err, response) {
        res.send(response.clientToken);
      });
    });
    
    app.post("/checkout_sb_bt", function (req, res) {
    
      console.log("final call -----------------------------")
        var gateway = braintree.connect({
            environment: braintree.Environment.Sandbox,
        //    accessToken: "access_token$sandbox$55g8cq9ftqx5ysq5$1082e02169772c9637782fbd470d2aaa"
        merchantId: "wmc99tkkch665f7h",
        publicKey: "k92zxzj52fsfj27m",
        privateKey: "7453bd31fb6b8dc4ea894e4d820950df"
        });
          console.log('nonce from the client ----------',nonceFromTheClient);
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

      app.get("/capture_auth", function (req, res) {
        console.log('capture auth ', req.query.id, req.query.amount);
        
          var gateway = braintree.connect({
            environment: braintree.Environment.Sandbox,
        //    accessToken: "access_token$sandbox$55g8cq9ftqx5ysq5$1082e02169772c9637782fbd470d2aaa"
            accessToken : "access_token$sandbox$cmsjrxqjrjzbcz2r$3ea9b37593fb87eccaa70d92ddf6babf"
        });
        gateway.transaction.submitForPartialSettlement(req.query.id, req.query.amount, function (err, result) {
          console.log(err);
          if(err) {
            return res.json(err);
          }
          if (result && result.success) {
            var settledTransaction = result.transaction;
            console.log(settledTransaction)
            return res.json(settledTransaction)
          } else {
            console.log(result && result.errors);
            res.json(result && result.errors)
          }
        });
      });

      app.get("/refund", function (req, res) {
        console.log('refund', req.query.id, req.query.amount);
        
          var gateway = braintree.connect({
            environment: braintree.Environment.Sandbox,
        //    accessToken: "access_token$sandbox$55g8cq9ftqx5ysq5$1082e02169772c9637782fbd470d2aaa"
            accessToken : "access_token$sandbox$cmsjrxqjrjzbcz2r$3ea9b37593fb87eccaa70d92ddf6babf"
        });
        gateway.transaction.refund(req.query.id, req.query.amount, function (err, result) {
          console.log(err);
          if(err) {
            return res.json(err);
          }
          if (result && result.success) {
            var settledTransaction = result.transaction;
            console.log(settledTransaction)
            return res.json(settledTransaction)
          } else {
            console.log(result && result.errors);
            res.json(result && result.errors)
          }
        });
      });


module.exports = app;
