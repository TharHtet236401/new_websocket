
const {MongoClient} = require("mongodb")

let dbConnection;

module.exports={
    connectToDb:(cb)=>{
        MongoClient.connect('mongodb://localhost:27017/BookStore')
        .then((client)=>{
            dbConnection = client.db();
            return cb();
        })
        .catch(err=>{
            console.log("Error in connecting with db")
            return cb();
        })
    },

    getDb:()=> dbConnection

}