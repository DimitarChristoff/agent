/**
 * Module dependencies.
 */

var express = require('express')

var app = express.createServer()

app.use(express.bodyParser())

app.get('/', function(req, res){
    res.redirect('/test/')
})

app.get('/error', function(req, res){
    res.status(500).send('fail')
})

app.get('/unauthorized', function(req, res){
    res.send(401)
})

app.get('/bad-request', function(req, res){
    res.send(400)
})

app.get('/not-acceptable', function(req, res){
    res.send(406)
})

app.get('/no-content', function(req, res){
    res.send(204)
})

app.put('/user/:id', function(req, res){
    res.send('updated')
})

app.patch('/user/:id', function(req, res){
    res.send('updated')
})

app.get('/querystring', function(req, res){
    res.send(req.query)
})

app.post('/todo/item', function(req, res){
    var buf = ''
    if (req.body){
        for (var x in req.body){
            buf += '' + x
        }
        res.send('added "' + buf + '"')
    } else {
        req.on('data', function(chunk){
            buf += chunk
        })
        req.on('end', function(){
            res.send('added "' + buf + '"')
        })
    }
})

app.post('/user/:id/pet', function(req, res){
    res.send('added pet "' + req.body.pet + '"')
})

app.post('/user', function(req, res){
    res.send('created')
})

app.del('/user/:id', function(req, res){
    res.send('deleted')
})

app.all('/echo-header/:field', function(req, res){
    res.send(req.headers[req.params.field])
})

app.post('/echo', function(req, res){
    res.send(req.body)
})

app.post('/pet', function(req, res){
    res.send('added ' + req.body.name + ' the ' + req.body.species)
})

app.get('/pets', function(req, res){
    res.send(['tobi', 'loki', 'jane'])
})

app.get('/foo', function(req, res){
    res
        .header('Content-Type', 'application/x-www-form-urlencoded')
        .send('foo=bar')
})

var fs = require('fs')
app.get('/test/mocha.js', function(req, res){

    var file = __dirname + '/../node_modules/mocha/mocha.js'
    fs.readFile(file, function(err, data){
        res.header('Content-Type', 'text/javascript').send(data)
    })

})

var qs = require('querystring')
var url = require('url')
var wrapup = require('wrapup')

app.get('/test/test.js', function(req, res){

    var parsed = url.parse(req.url)
    var pathname = parsed.pathname
    if (pathname == '/test/test.js' && parsed.search){

        var query = qs.parse(parsed.search.slice(1))
        var wrup = wrapup()
        wrup.log()

        for (var q in query){
            if (query[q]){
                wrup.require(q, __dirname + '/../' + query[q])
            }
            else {
                wrup.require(__dirname + '/../' + q)
            }
        }

        res.header('Content-Type', 'text/javascript')
        res.send(wrup.up())
    } else {
        res.send('')
    }
})

app.get('/test/mocha.css', function(req, res){
    var file = __dirname + '/../node_modules/mocha/mocha.css'
    fs.readFile(file, function(err, data){
        res.header('Content-Type', 'text/css').send(data)
    })
})

app.use(express.static(__dirname + '/../'))

app.listen(8080)
console.log('Test server listening on port 8080')
