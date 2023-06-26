
var db=require('../config/connection');
// var ObjectId=require('mongodb').ObjectId;
// const { ObjectId } = require('mongodb');
var objectId=require("mongodb").ObjectId
// var ObjectId=require('mongodb').ObjectId;
var collection=require('../config/collection')
const bcrypt = require('bcrypt');


module.exports=
{
    dosignUp:(userData)=>
    {
        return new Promise (async(resolve,reject)=>
        {
            userData.password=await bcrypt.hash(userData.password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>
            {
                // console.log('inserted',data);
                userData._id = data.insertedId;
                resolve(userData)
            })
        })
    },
    doLogin:(loginData)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            // console.log(loginData);
            let response={};
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:loginData.email})
            if(user)
            {
                console.log('user found');
                await bcrypt.compare(loginData.password,user.password).then((status)=>
                {
                    // if(status)
                    // {
                    //     console.log("login success");
                    //     resolve(user)
                    // }
                    // else
                    // {
                    //     console.log("password error");
                    // }
                    if(status)
                    {
                        console.log("login success");
                        response.user=user;
                        response.status=status;
                        resolve(response);
                    }
                    else
                    {
                        console.log("login failed");
                        resolve(status=false)
                    }
                })
            }
            
        })
    },

    placeOrder:(details)=>
    {
        return new Promise ((resolve,reject)=>
        {
            const order = { ...details, user: new objectId(details.user) };
            db.get().collection(collection.ORDER_COLLECTION).insertOne(order).then(()=>
            {
                resolve()
            })
        })
    },
    veiwOrders: (id) => {
        return new Promise(async(resolve, reject) => {
          if (!objectId.isValid(id)) {
            reject(new Error('Invalid user ID'));
            return;
          }
          console.log("entered function");
            let orders =await  db.get()
            .collection(collection.ORDER_COLLECTION)
            .find({ user: new objectId(id) })
            .toArray()

            console.log(orders)
              
                resolve(orders);
              
            })
        },
        getOrders: () => {
            return new Promise(async(resolve, reject) => 
            {
                let orders = await db.get()
                .collection(collection.ORDER_COLLECTION)
                .find()
                .toArray();
        
              console.log(orders);
              resolve(orders);
            })
          },

}