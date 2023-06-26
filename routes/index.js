var express = require('express');
var router = express.Router();
var collection=require('../config/collection');
const userHelpers = require('../helpers/userHelpers');


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.get('/',(req,res)=>
{
  userHelpers.getOrders().then((orders)=>
  {
    // console.log(orders);
    // for (let order of orders) {
    //   for (let product of order.products) {
    //     console.log(product);
        // Access the properties of the product object here
    //   }
    // }
    // console.log("this is customer"+orders.user);
      res.render('admin/all-orders',{orders,admin:true})

  })
})
module.exports = router;
