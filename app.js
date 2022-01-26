const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const getData = require('./mongo.js')

const app = express()
app.set('view engine','ejs')

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

const port = 3000
//end initial config

//real deal
app.get('/',(req,res)=>{   
    getData('select').then(dat =>{
        res.render('index',{allData:dat});
    })
})

app.post('/',(req,res)=>{  
    
    if(req.body.com === 'create'){
        let d = new Date()
        const data = {
            name: req.body.data,
            date: `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`,
            done: 'no'
        }
        getData('insert', data)
        res.redirect('/')
        
    }else if(req.body.com === 'delete'){
        const data = req.body.data
        getData('delete', data)
        res.redirect('/')
    }
})

app.listen(port, ()=>{
    console.log(`app listen at port: ${port} `)
})