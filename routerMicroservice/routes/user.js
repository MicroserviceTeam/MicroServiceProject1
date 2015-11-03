var express = require('express');
var router = express.Router();
var sign = require('../sign');
var config = require('../config');
var mongo = require('mongoskin');

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

router.post('/course', function(req, res, next) {
    console.log(req.body.name);
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
//DataModel change & Partition
router.put('/studentsDataModel/:attribute', function(req, res, next) {
    var attributeToadd = req.params.attribute;
    var output = '';
    var servers = config.getServerList('students');
    for(var index = 0; index < servers.length; index++) {
        var serverlist = servers[index].split(':');
        sign.findforDataModel(req, res, serverlist[0], serverlist[1], '/studentsDataModel/'+attributeToadd);
    }
    res.send(JSON.stringify({ RET:200,status:"success" }));
});

router.delete('/studentsDataModel/:attribute', function(req, res, next) {
    var attributeToadd = req.params.attribute;
    var output = '';
    var servers = config.getServerList('students');
    for(var index = 0; index < servers.length; index++) {
        var serverlist = servers[index].split(':');
        sign.findforDataModel(req, res, serverlist[0], serverlist[1], '/studentsDataModel/'+attributeToadd);
    }
    res.send(JSON.stringify({ RET:200,status:"success" }));
});
router.put('/coursesDataModel/:attribute', function(req, res, next) {
    var attributeToadd = req.params.attribute;
    var output = '';
    var servers = config.getServerList('courses');
    for(var index = 0; index < servers.length; index++) {
        var serverlist = servers[index].split(':');
        sign.findforDataModel(req, res, serverlist[0], serverlist[1], '/coursesDataModel/'+attributeToadd);
    }
    res.send(JSON.stringify({ RET:200,status:"success" }));
});

router.delete('/coursesDataModel/:attribute', function(req, res, next) {
    var output = '';
    var attributeToadd = req.params.attribute;
    var servers = config.getServerList('courses');
    for(var index = 0; index < servers.length; index++) {
        console.log(serverlist[0]);
        var serverlist = servers[index].split(':');
        sign.findforDataModel(req, res, serverlist[0], serverlist[1], '/coursesDataModel/'+attributeToadd);
    }
    res.send(JSON.stringify({ RET:200,status:"success" }));
});

router.get('/studentsPartition', function(req, res, next) {
    var servers = config.getServerParitition('students');
    res.send(servers);
});

router.post('/studentsPartition/:splitChars', function(req, res, next) {
    var servers = config.getServerParitition('students');
    var splitChars = req.params.splitChars;
    var num = servers.length;
    if (splitChars.length/2 > num)
        res.send(JSON.stringify({ RET:400,status:"bad request" }));
    else if (splitChars.length/2 < num)
        res.send(JSON.stringify({ RET:400,status:"bad request" }));
    else {
        var list = new Array();
        var oriStart = config.getoriStart('students');
        var oriEnd = config.getoriEnd('students');
        //config.setPartition('students',splitChars);
        var servers = config.getServerList('students');
        for(var index = 0; index < 1; index++) {
            var serverlist = servers[index].split(':');
            sign.findforPartition(req, res, serverlist[0], serverlist[1],
                '/student/repartition',oriStart[index],oriEnd[index],
                splitChars[index*2],splitChars[index*2+1],function(res2, data){
                    var jsonObj=JSON.parse(data);
                    for(var i=0,size=jsonObj.length;i<size;i++){
                        var record=jsonObj[i];
                        var server = config.find('students', record.name[0]);
                        var serverlist2 = server.split(':');
                        sign.findforResendData(req, res, serverlist2[0], serverlist2[1],'/students',record);
                    }
                });
        }
    }
    res.send(JSON.stringify({ RET:200,status:"success" }));
});

router.get('/coursesPartition', function(req, res, next) {
    var servers = config.getServerParitition('courses');
    res.send(servers);
});

router.post('/coursesPartition/:splitChars', function(req, res, next) {
    var servers = config.getServerParitition('courses');
    var splitChars = req.params.splitChars;
    var num = servers.length;
    if (splitChars.length > num)
        res.send(JSON.stringify({ RET:400,status:"bad request" }));
    else if (splitChars.length < num)
        res.send(JSON.stringify({ RET:400,status:"bad request" }));
    else {
        var list = new Array();
        var oriStart = config.getoriStart('courses');
        var oriEnd = config.getoriEnd('courses');
        //config.setPartition('courses',splitChars);
        var servers = config.getServerList('courses');
        for(var index = 0; index <servers.length; index++) {
            var serverlist = servers[index].split(':');
            sign.findforPartition(req, res, serverlist[0], serverlist[1],
                '/course/repartition',oriStart[index],oriEnd[index],
                splitChars[index],splitChars[index+1],function(res2, data){
                    var jsonObj=JSON.parse(data);
                    for(var i=0,size=jsonObj.length;i<size;i++){
                        var record=jsonObj[i];
                        var server = config.find('courses', record.name[0]);
                        var serverlist2 = server.split(':');
                        sign.findforResendData(req, res2, serverlist2[0], serverlist2[1],'/courses',record);
                    }
                });
        }
    }
});
module.exports = router;

