const express = require('express');
const router = express.Router();
const news = require('../models/news');
const User = require('../models/users');


const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

router.get('/', (req, res)=>{
    const token = localStorage.getItem('authtoken')
    console.log("token>>>",token)
    if (!token) {
        res.redirect('/')
    }
    jwt.verify(token, config.secret, (err, decoded)=>{
        if (err) { res.redirect('/') }
        User.findById(decoded.id, { password: 0}, (err,user)=>{
            if (err) {
                res.redirect('/');
            }
            if (!user) {
                res.redirect('/');
            } 
            console.log("/news/form : user ==> ", user)  
            let id_ = req.query.id; 
            if(id_ == null)
            {
                news.find({}, (err,data)=>{
                    if(err) res.status(500).send(err)
                    else{
                        res.render('newstable', {
                            user,
                            data
                        });
                    }        
                });
            }
            else{
                news.find({_id: id_}, (err,data)=>{
                    if(err) res.status(500).send(err)
                    else{
                        console.log("/news/id : data : ", data);
                        res.send(data);
                    }
                })
            }
            
        });
    });
});
/*
router.get('/:id', (req,res)=>{
    const id = req.params.id
    console.log("/news : id : ", id)
    news.find({_id: id}, (err,data)=>{
        if(err) res.status(500).send(err)
        else{
            console.log("/news/id : data : ", data);
            res.send(data);
        }
    })
});
*/

router.put('/', (req,res)=>{
    const id = req.body.id;
    console.log("PUT /news/", id);
    news.findOneAndUpdate({_id: id},{
        $set:{
            title: req.body.title,
            description: req.body.description,
            url: req.body.url,
            urlToImage: req.body.urlToImage,
            publishedAt: req.body.publishedAt,
            insertTime: Date.now()
        }
    },{
        upsert: true
    }, (err,result)=>{
        if(err) return res.send(err)
        res.send("Updated ...")
    }) 
});


router.delete('/:id', (req,res)=>{
    const id = req.params.id;
    const token = localStorage.getItem('authtoken');
    console.log("token>>>",token);
    if (!token) {
        res.redirect('/');
    }
    console.log("DELETE /News/id : id : ", id)
    news.findOneAndDelete({_id: id}, (err,result)=>{
        if(err) return res.status(500).send(err);
        res.send({message: 'deleted ...'});
        console.log(result);
    })
});

router.post('/', (req, res)=>{
    console.log("/addNews : req.body : ", req.body)
    const token = localStorage.getItem('authtoken');
    console.log("token>>>",token)
    if (!token) {
        res.redirect('/')
    }
    jwt.verify(token, config.secret, (err, decoded)=>{
        if (err) { res.redirect('/') }
        User.findById(decoded.id, { password: 0}, (err,user)=>{
            if (err) {res.redirect('/')}
            if (!user) {res.redirect('/')} 
            console.log("/newsform : user ==> ", user);
            
            const d = Date.now()
            const newsItem = {...req.body, insertTime: d }
            console.log("POST /news : news => ", news);

            news.create(
                newsItem
            , (err, data) => {
                if(err) return res.status(500).send('There was a problem creatign the news record')
                console.log(`Inserted ... ${data} `)
                const htmlMsg = encodeURIComponent('News Added !');
                res.redirect('/api/news/form/?msg=' + htmlMsg);
            })            

        })
    })
})
/*
api/news/headlines?count=3
*/
router.get('/headlines', (req,res) => {
    news.find({}).limit(req.query.count).sort( {insertTime: -1} ).exec((err,data)=>{
      if (err) res.status(500).send(err)
      else res.json(data)
    })
})


router.get('/form', (req, res)=>{
    const token = localStorage.getItem('authtoken')
    console.log("token>>>",token)
    if (!token) {
        res.redirect('/')
    }
    jwt.verify(token, config.secret, (err, decoded)=>{
        if (err) { res.redirect('/') }
        User.findById(decoded.id, { password: 0}, (err,user)=>{
            if (err) {res.redirect('/')}
            if (!user) {res.redirect('/')} 
            console.log("/newsForm : user ==> ", user)   
            res.render('newsform', {
                user,
                msg: req.query.msg?req.query.msg:''
            })
        })
    })
  })
  

module.exports = router;