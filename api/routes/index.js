const express = require('express')
var urlencodedParser = express.urlencoded({ extended: false })
const router = express.Router()
var cors = require('cors');


const payuController = require('../controller/payuController')

var app = express();

app.use(cors());

const corsOptions = {
  origin: "http://localhost:3000"
};

router.post(
  '/payu',
  urlencodedParser,
  cors(corsOptions),
  payuController.pay
)

router.post('/verification',
  urlencodedParser,
  cors(corsOptions),
  payuController.redirect

)

module.exports = router