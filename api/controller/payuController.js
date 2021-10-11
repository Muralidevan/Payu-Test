
const dotenv = require('dotenv');

dotenv.config();

const payuController = {}

const ENV = process.env.NODE_ENV || 'dev';

const salt = ENV === 'dev' ? process.env.PAYU_SALT_KEY_DEV_ID : process.env.PAYU_SALT_KEY_PROD_ID;

payuController.pay = (req, res) => {

  let txnid = "";
  let length = 10; // 10 digits random transaction ID.
  let sample = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    txnid += sample.charAt(Math.floor(Math.random() * sample.length));
  }
  // console.log(txnid);

  const amount = req.body.amount;
  const productinfo = req.body.productinfo;
  const firstname = req.body.firstname;
  const email = req.body.email;
  const phone = req.body.phone;

  const surl = req.body.surl;

  const furl = req.body.furl;

  const key = req.body.key;
  // string hash format
  const str = key + '|' + txnid + '|' + amount + '|' + productinfo + '|' + firstname + '|' + email + '|' + '||||||||||' + salt;
  const hash = require('crypto').createHash('sha512').update(str).digest('hex');

  // const service_provider = 'payu_paisa';
  // console.log(hash, 'hash')

  const formData = {
    'key': key,
    'txnid': txnid,
    'amount': amount,
    'productinfo': productinfo,
    'firstname': firstname,
    'email': email,
    'phone': phone,
    'surl': surl,
    'furl': furl,
    'hash': hash,
    'salt': salt,
    // 'service_provider': service_provider
  }

  //other packages to use for http requets got, node-fetch or axios ,since request is deprecated
  const request = require('request');
  // for live key and salt - use 'https://secure.payu.in/_payment' 

  request.post({
    url: 'https://test.payu.in/_payment',
    form: formData,
  },
    function (err, response, body) {
      // console.log(err, 'err')
      // console.log(response, 'response')
      const location = response.caseless.dict.location;
      // console.log(location, 'location')
      // response.caseless.dict['access-control-allow-origin'] = 'https://localhost:5000'
      if (location) {
        res.status(200).json({ status_code: 200, url: location })
      }
      else {
        res.status(400).json({ status_code: 400, message: 'location not found' })
      }
    });

}

payuController.redirect = (req, res) => {

  // console.log(req.body, 'req.body')

  const amount = req.body.amount;
  const productinfo = req.body.productinfo;
  const firstname = req.body.firstname;
  const email = req.body.email;
  const txnid = req.body.txnid;
  // const phone = req.body.phone;
  const status = req.body.status;
  // const key = req.body.key;
  const key = req.body.key;

  const payuHash = req.body.hash;

  const str = salt + '|' + status + '|' + '||||||||||' + email + '|' + firstname + '|' + productinfo + '|' + amount + '|' + txnid + '|' + key;
  const hash = require('crypto').createHash('sha512').update(str).digest('hex');

  if (hash === payuHash && status === 'success') {
    //save details to db and send mail to user(optional)
    console.log('Transaction verified')
    res.redirect('http://localhost:3000/about')
  }
  else {
    console.log('Transaction Malformed')

    res.redirect('http://localhost:3000/dashboard')
  }
  // console.log(req, 'request from payu')
}

module.exports = payuController