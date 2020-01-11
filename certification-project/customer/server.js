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
app.set('port',port);
app.get('/', async (req,res)=>{
    try{
        const loc = await userloc();
        const lon = loc.longitude
        const lat = loc.latitude
        //console.log(`lon: ${lon}, lat: ${lat}`);
    
        const response = await getWeather(lon,lat);
        const weather = {
                description: response.data.weather[0].main,
                icon: "http://openweathermap.org/img/w/" + response.data.weather[0].icon + ".png",
                temperature: response.data.main.temp,
                temp_min: response.data.main.temp_min,
                temp_max: response.data.main.temp_max,
                city: response.data.name
        }
        //console.log("weather: ", weather);
        const news = await newsModel.find().limit(3);
        //console.log(news);
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





var http = require('http');
const server = http.createServer(app).listen(app.get('port'), () => {
    console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);



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
let usersSocketIds = [];
let users = [];
let topicId = 3;

const getNextTopicId = () =>{
    return ++topicId;
}
// connection event
// socket represents each client connected to our server
io.on('connection',  (socket) => {
    console.log("New connection socket.id : ", socket.id);
    users.push(
        {"key" : socket.id,
        "socket" : socket}
    );
    socket.on('user-leave-topic',(topic)=>{
        socket.leave(topic);
    })
    
    socket.on('user-entered-topic', (data)=>{
        console.log(data);
        topics.push(data.active);
        usersSocketIds.push(data.socketId);
        let userEnteredHtml = `<div class="new_user_entered">
                                <div class="new_user">
                                    <p>New user entered to the chat</p>
                                </div>`;
        const sId = data.socketId;
        let dataMsg={
            text: userEnteredHtml,
            socketId : sId};
        console.log(dataMsg);
        socket.join(data.active,() => {
            let rooms = Object.keys(socket.rooms);
            console.log(rooms); // [ <socket.id>, 'room 237' ]            
            console.log(dataMsg);
            io.to(data.active).emit('new-user-entered',dataMsg); // broadcast to everyone in the room
        });
        
    });

    socket.on('disconnect', ()=>{
        users =  users.filter((user)=>{
            return user.key != socket.id;
        })
        console.log("disconnected");
        console.log(users);
    })

  
    socket.on('add-new-topic', (data) => {
        let sTopicId = getNextTopicId();
        const element = `<div id="${sTopicId}" class="topic_item" onclick="location.href='#';" style="cursor: pointer;">
                            <div class="chat_people">
                                <div class="chat_img"> <i class="fa fa-users fa-2x" aria-hidden="true"></i> </div>
                                <div class="chat_ib">
                                    <h5 class="topic_title">${data.topic}</h5>
                                    <p>${data.description}</p>
                                </div>
                            </div>
                        </div>`
       socket.emit("new-topic-added",{
           text : element,
           socketId :data.socketId
       });
    });


    socket.on('new-message', (data) => {
        console.log("new-message called with data",data);
        const message = data;
        //const response = ejs.render('/templates/incomingMsg',{message})
        const response = `<div class="incoming_msg">
                            <div class="incoming_msg_img">
                            <img src="https://ptetutorials.com/images/user-profile.png" alt="Annonymous User">
                            </div>
                            <div class="received_msg">
                            <div class="received_withd_msg">
                                <p>${data.message}</p>
                                <span class="time_date"> ${message.timeStamp} </span></div>
                            </div>
                        </div>`;
        io.to(data.topic).emit('incoming-message',{
            text:response,
            socketId: data.socketId}
            );
    });
});



