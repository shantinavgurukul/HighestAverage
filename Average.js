const express = require('express');
const app = express();
app.use(express.json());
var port = 2000;

const knex = require("knex")({
    client: "mysql",
    version: '7.2',
    connection: {
      host: "localhost",
      user: "root",
      password: "Shanti123#@!",
      database: "student_details"
    }
})

knex.schema.hasTable("canditate").then((exits) => {
    if(!exits){
        return knex.schema.createTable("canditate" , (t) => {
            t.increments('id').primary();
            t.string("name").notNullable();
            t.string("emailAddress").notNullable();

        })
    }
})

knex.schema.hasTable("test_score").then((exits) => {
    if(!exits){
        return knex.schema.createTable("test_score" , (t) => {
            t.increments('id').primary();
            t.integer("first_round")
            t.integer("second_round")
            t.integer("third_round")
        })
    }
})
app.post('/postingData',(req,res) => {
    knex('canditate').insert({
        name : req.body.name,
        emailAddress :req.body.emailAddress
    })
    .then(() => {
        res.send("created!!")
        console.log("created!!");
    }).catch((err) =>{
        res.send(err)
        console.log(err);

    })
})

app.post('/postingDataTest',(req,res) => {
    knex('test_score').insert({
        first_round : req.body.first_round,
        second_round : req.body.second_round,
        third_round : req.body.third_round

    }).then(() => {
        res.send("createdTESTSCORE!!")
        console.log("createdTESTSCORE!!");

    }).catch((err) =>{
        res.send(err)
        console.log(err);

    })
})
app.get('/highestScore',(req,res) => {
    knex.select("*").from("canditate").innerJoin("test_score" , "canditate.id","test_score.id")
    .then((data) => {
        console.log(data,"shnatiiiiiiiiii");
        // res.send(data)
        var average_score = [] ;
        for(var i=0; i<data.length; i++){
            console.log(data[i].first_round + " " + data[i].second_round + " " + data[i].third_round)
            var average = (data[i].first_round +  data[i].second_round + data[i].third_round)/3;
            average_score.push({id: data[i].id, name : data[i].name , emailAddress : data[i].emailAddress ,  average_score: average})

        }
        res.send(average_score)
        console.log(average_score)

    })
})
app.listen(port,() => {
    console.log("server is working with port is 2000!!");
})