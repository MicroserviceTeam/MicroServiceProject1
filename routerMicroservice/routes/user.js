var express = require('express');
var router = express.Router();
var sign = require('../sign');
var config = require('../config');

router.get('/courses', function(req, res, next) {
    var outputs = '';
	var servers = config.getServerList('courses');
    console.log(servers);
    for(var index = 0; index < servers.length; index++) {
        /*var output='hehe';
        var serverlist = servers[index].split(':');
        var outputss = sign.find(req, res, serverlist[0], serverlist[1], output);
        console.log(output);
        outputs += output;*/
        var serverlist = servers[index].split(':');
        sign.finds(req, res, serverlist[0], serverlist[1]);
    }
    //res.send(outputs);
});

router.get('/courses/:name', function(req, res, next) {
    var server = config.find('courses', req.params.name[0]);
    var serverlist = server.split(':');
    sign.finds(req, res, serverlist[0], serverlist[1]);
});

router.post('/courses', function(req, res, next) {
    console.log(req.body.name[0]);
    var server = config.find('courses', req.body.name[0]);
    console.log(server);
    var serverlist = server.split(':');
    sign.finds(req,res,serverlist[0],serverlist[1]);
});

router.post('/findCourses', function(req, res, next) {
    var server = config.find('courses', req.body.name[0]);
    var serverlist = server.split(':');
    sign.finds(req,res,serverlist[0],serverlist[1]);
});

router.post('/addStudentToCourse', function(req, res, next) {
    var server = config.find('courses', req.body.coursename[0]);
    var serverlist = server.split(':');
    sign.findSpecific(req, res, serverlist[0], serverlist[1], '/addStudentToCourse');
    server = config.find('students', req.body.studentname[0]);
    serverlist = server.split(':');
    sign.findSpecific(req, res, serverlist[0], serverlist[1], '/addCourseToStudent');
    res.send(JSON.stringify({ RET:200,status:"success" }));
});

router.put('/courses/:name', function(req, res, next) {
    var server = config.find('courses', req.params.name[0]);
    var serverlist = server.split(':');
    sign.finds(req,res,serverlist[0],serverlist[1]);
});

router.delete('/courses/:name', function(req, res, next) {
    var server = config.find('courses', req.params.name[0]);
    var serverlist = server.split(':');
    sign.finds(req,res,serverlist[0],serverlist[1]);
});

router.delete('/deleteStudentFromCourse', function(req, res, next) {
    var server = config.find('courses', req.body.coursename[0]);
    var serverlist = server.split(':');
    sign.findSpecific(req, res, serverlist[0], serverlist[1], '/deleteStudentFromCourse');
    server = config.find('students', req.body.studentname[0]);
    serverlist = server.split(':');
    sign.findSpecific(req, res, serverlist[0], serverlist[1], '/deleteCourseFromStudent');
    res.send(JSON.stringify({ RET:200,status:"success" }));
    
});

router.get('/students', function(req, res, next) {
    var outputs = '';
    var output = '';
    var servers = config.getServerList('students');
    for(var index = 0; index < servers.length; index++) {
        var serverlist = servers[index].split(':');
        sign.find(req, res, serverlist[0], serverlist[1], output, function(res2, data){
            
        })
        outputs += output;
    }
    res.send(outputs);
});

router.get('/students/:name', function(req, res, next) {
    var server = config.find('students', req.params.name[0]);
    var serverlist = server.split(':');
    sign.find(req, res, serverlist[0], serverlist[1]);
});

router.post('/students', function(req, res, next) {
    var server = config.find('students', req.body.name[0]);
    var serverlist = server.split(':');
    sign.find(req, res, serverlist[0], serverlist[1]);
});

router.put('/students/:name', function(req, res, next) {
    var server = config.find('students', req.params.name[0]);
    var serverlist = server.split(':');
    sign.find(req, res, serverlist[0], serverlist[1]);
});

router.delete('/students/:name', function(req, res, next) {
    var server = config.find('students', req.params.name[0]);
    var serverlist = server.split(':');
    sign.find(req, res, serverlist[0], serverlist[1]);
});

router.post('/findStudents', function(req, res, next) {
    var server = config.find('students', req.body.name[0]);
    var serverlist = server.split(':');
    sign.finds(req,res,serverlist[0],serverlist[1]);
});
module.exports = router;
