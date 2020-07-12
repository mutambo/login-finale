const express = require('express')
const mysql = require('mysql')
const bodyparser = require('body-parser');

const app = express();
//mysql://b65843223fc0bf:75a25c3f@us-cdbr-east-02.cleardb.com/heroku_6cc4c98f9e0720d?reconnect=true
const connection = mysql.createConnection({
    host: 'us-cdbr-east-02.cleardb.com',
    user: 'b65843223fc0bf',
    password: '75a25c3f',
    database: 'heroku_6cc4c98f9e0720d'
})
connection.connect((err) => {
    if (err) throw err
    console.log('connected successfully')
})

app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set('port', (process.env.PORT || 4000))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
app.post('/signup', (req, res) => {
    let sql = "INSERT INTO users(u_email,u_password) VALUES('" + req.body.email + "','" + req.body.password + "');"
    connection.query(sql, (err, results) => {
        if (err) throw err
        res.send("<a href ='/'>click here to login</a>")
    })
})

app.post('/login', (req, res) => {
    let sql = "SELECT * FROM users WHERE u_email='"+req.body.email+"' AND u_password='"+req.body.password+"';"
    connection.query(sql,(err, result) => {
        if (err) throw err;
        console.log(result[0].u_email);
        if (result !== '') {
            let email = result[0].u_email;
            let password = result[0].u_password;

            if (req.body.email == email && req.body.password == password) {
                res.sendFile(__dirname + '/welcome.html')
            } else {
                res.sendFile(__dirname + '/index.html')
            }
        }else{
            res.sendFile(__dirname + '/index.html')
        }
    })

})

app.listen(app.get('port'), () => {
    console.log("listening to port 4000", app.get('port'));
})