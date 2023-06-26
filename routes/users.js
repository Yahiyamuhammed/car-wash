var express = require('express');
var router = express.Router();
var userHelpers=require('../helpers/userHelpers');
const bcrypt = require('bcrypt');
const session = require('express-session');



function verifyLogin(req,res,next)
  {
    let originalUrl = req.originalUrl; // Store the current URL

    let user=req.session.user
    
    console.log(user);
    if(user){
     
      next()
      console.log("user exist");}
    else{
      req.session.originalUrl = originalUrl;
      console.log("this is url ",req.session.originalUrl);
      res.redirect('/login');console.log("redirecting to login");}
  }

/* GET users listing. */
router.get('/', (req, res) =>
{
  let user=req.session.user;
  console.log("this is user",user);
  res.render('home',{user});
});
router.get('/login',(req,res)=>
{
//   if( req.session.user)
//   res.redirect('/order')
// else{console.log("logging");
// res.render('user/login')}
  // res.render('user/login')

  if(req.session.user)
  {
    res.redirect('/');
    console.log("redirecting");
    
  }
  else
  {
    console.log("logging");
    res.render('user/login',{loginErr:req.session.userLoginErr});
    // console.log("err");
    req.session.userLoginErr=false;


  }
})
router.post('/login',(req,res)=>
  {
    console.log(req.body);
    userHelpers.doLogin(req.body).then((response)=>
    {
      // console.log("loged in",response);
      // req.session.user=response;

      // req.session.userLoggedin=true;

      
      // res.redirect('/')
      if(response.status)
      {
        req.session.user=response.user;
        req.session.userLoggedIn = true;

        // res.redirect('/')
        // Check if originalUrl is stored in session
  const originalUrl = req.session.originalUrl;
  if (originalUrl) {
    // Clear the stored URL from session
    delete req.session.originalUrl;
    // Redirect to the stored URL
    res.redirect(originalUrl);
  } else {
    // Redirect to a default URL
    res.redirect('/');
  }
      }
      else
      {
        req.session.userLoginErr="ivalid login credentials";
        res.redirect('/login')
      }
    })
  })

router.post('/signup',(req,res)=>
  {
    console.log(req.body);
    userHelpers.dosignUp(req.body).then((response)=>
    {
      console.log("signed up",response);
      if(response)
      {
        req.session.user=response;
        // req.session.userLoggedin=true;
        res.redirect('/')
      }
    })
  })

router.get('/order',verifyLogin,(req,res)=>
{
  const productId = req.query.productId;
  let user=req.session.user._id
  res.render('user/place-order',{user,productId})
})

router.post('/address',(req,res)=>
{
  console.log(req.body)
  userHelpers.placeOrder(req.body).then((response)=>
  {

    console.log("order placed");
    res.send('<script>alert("Order placed successfully."); window.location="/";</script>');
    // res.render('user/success')
  })
})
// router.get('/view-orders/:user',async(req,res)=>
// {
//   const user = req.params.user;
//   console.log(user);
//   let orders=await userHelpers.veiwOrders(user)
  
//     console.log("done");
//     res.render('user/orders',{orders})
  
//   // let user=req.session.user._id
//   // res.render('user/place-order',{user})
// })

router.get('/view-orders/:user',verifyLogin, async (req, res) => {
  const user = req.params.user;
  console.log(user);
  try {
    let orders = await userHelpers.veiwOrders(user);
    console.log("done");
    res.render('user/orders', { orders });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving orders');
  }
});

module.exports = router;
