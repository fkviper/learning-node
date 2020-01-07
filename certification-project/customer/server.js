const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path =require('path');
const ejs = require('ejs');
const db = require('./db');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const userloc =require('./utility/location');
const  getWeather =require('./utility/weather');
const newsModel = require('./models/news');
const port = 3002;

app.set('view engine', 'ejs')
app.set('views', './views')

app.get('/', async (req,res)=>{
    try{
        const loc = await userloc();
        const lon = loc.longitude
        const lat = loc.latitude
        console.log(`lon: ${lon}, lat: ${lat}`);
    
        const response = await getWeather(lon,lat);
        const weather = {
                description: response.data.weather[0].main,
                icon: "http://openweathermap.org/img/w/" + response.data.weather[0].icon + ".png",
                temperature: response.data.main.temp,
                temp_min: response.data.main.temp_min,
                temp_max: response.data.main.temp_max,
                city: response.data.name
        }
        console.log("weather: ", weather);
        const news = await newsModel.find().limit(3);
        console.log(news);
        res.render('home', {
                    weather,
                    news
                });
    }
    catch(error){
        res.status(500).send(error);
    }
    
})


app.get('/about_us', (req,res)=>{
    res.render('about_us')
})

app.get('/contact_us', (req,res)=>{
    res.render('contact_us', {
        msg: req.query.msg?req.query.msg:''
    })
})


app.listen(port, () => {
    console.log('Customer server listening on port ' + port);
  });


const http = require('http');
const server = http.createServer(app).listen(app.get('port'), () => {
    console.log("Express server listening on port " + app.get('port'));
});
const io = require('socket.io').listen(server);


/*
topic = {
    id,
    title,
    messages
}

message ={
    type(incoming/outgoing/user)
    username
    textMsg
    timestamp
}
*/
let topics = [];

// connection event
// socket represents each client connected to our server
io.on('connection',  (socket) => {

    socket.on('connect', ()=>{
        console.log("New connection socket.id : ", socket.id)
    })

    socket.on('disconnect', ()=>{
        console.log("disconnect => nickname : ", socket.nickname)
        const updatedUsers = users.filter(user => user != socket.nickname)
        console.log("updatedUsers : ", updatedUsers)
        users = updatedUsers
        io.emit('userlist', users)
    })

    // nick event
    socket.on('topic-created', (nickname) => {
        console.log("nick => nickname : ", nickname)
        socket.nickname = nickname
        users.push(nickname)

        console.log("server : users : ", users)
        // emit userlist event to all connected sockets
        io.emit('userlist', users);
    });

    // chat event
    socket.on('new-message', (data) => {
        const messgae = data;
        const response = ejs.render('./templates/incomingMsg',messgae);
        io.emit('incoming-message', response);
    });
});


