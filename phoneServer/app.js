const express = require('express');
const { Twilio } = require('twilio');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const getResponse = require('./components/script');
const phoneData = require('./components/phoneDB');

app.use(express.json());
app.use(cors());

const accountSid = "AC45319187b70a6e34612e8055462db305";
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = "VAda47f78ed6468e7d502febfc1ab385d6";
const client = require("twilio")(accountSid, authToken);

app.get('/api/transactions/:address', async (req, res) => 
{
  const addr = req.params.address;
  console.log("TRANSACTION:  ",addr)
  res.send(await getResponse(addr, "transactions"));
});

app.get('/api/requests/:address', async (req, res) => 
{
  const addr = req.params.address;
  res.send(await getResponse(addr, "requests"));
});

app.get('/api/escrow', async (req, res) => 
{
  const addr = req.query.addr;
  const hash = req.query.hash;
  res.send(await getResponse(addr, "escrow", hash));
});

app.get('/api/phoneNumber/:pubkey', async (req, res) => 
{
  const addr = req.params.pubkey;
  if((await phoneData.isRegistered(addr)) == true)
  {
    res.status(201);
  }
  else{
    res.status(400);
  }
    res.send();
});

app.get('/api/getPhoneNumber/:pubkey', async (req, res) => 
{
  const pubKey = req.params.pubkey;
  const phNum = await phoneData.getPhNum(pubKey);
  res.status(200).send(phNum);
});

app.get('/api/getPublicKey/:phNum', async (req, res) => 
{
  const phNum = req.params.phNum;
  const pubKey = await phoneData.getPublicKey(phNum);
  res.status(200).send(pubKey);
});

app.post('/api/phoneNumber', async (req, res) => 
{
  const phNum = req.query.phNum;
  const pubKey = req.query.pubKey;
  const retVal = await phoneData.storeData(phNum, pubKey);
  console.log(retVal);

  if(retVal == true)
  {
    res.status(201);
  }
  else{
    res.status(400);
  }
  res.send();
});


app.post('/send-otp', async (req, res) => {
  const phoneNumber = req.query.phNum;

  try{
    const otpResponse = await client.verify.v2
    .services(verifySid)
    .verifications.create({ to: '+'+phoneNumber, channel: "sms" })
    .then((verification) => console.log(verification.status));
    res.status(200).send("OTP Sent Successfully");
  }
  catch(error){
    console.log(error);
    res.send(400);
  }
});

app.post('/verify-otp', async (req, res) => {
  const otp = req.query.otpCode;
  const phoneNumber = req.query.phNum;

  try{
    const status = await client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: '+'+phoneNumber, code: otp })
        .then((verification_check) => console.log(verification_check.status))
    res.status(200).send("OTP Verification Successful")
  }
  catch(error){
    res.send(400);
  }
});


 

app.listen(port, async () => 
{
  await phoneData.InitCode();
  console.log(`Express server listening at http://localhost:${port}`);
});



/**TWILIO VERIFICATION
 * app.post('/send-otp', async (req, res) => {
  
  client.verify.v2
  .services(verifySid)
  .verifications.create({ to: "+17033467564", channel: "sms" })
  .then((verification) => console.log(verification.status))
  .then(() => {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question("Please enter the OTP:", (otpCode) => {
      client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: "+17033467564", code: otpCode })
        .then((verification_check) => console.log(verification_check.status))
        .then(() => readline.close());
    });
  });
});
 */