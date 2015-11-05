var express = require('express');
var router = express.Router();
var sign = require('../sign');
var config = require('../config');
var mongo = require('mongoskin');

router.get('/courses', function(req, res, next) {
    var outputs = [];
    var count = 0;
    var servers = config.getServerList('courses');
    console.log(servers);
    for(var index = 0; index < servers.length; index++) {
        var serverlist = servers[index].split(':');
        sign.findwithCallback(req, res, serverlist[0], serverlist[1],
        function(data){
            jsonObj = JSON.parse(data);
            for(var i=0,size=jsonObj.length;i<size;i++){
                var record=jsonObj[i];
                outputs.push(record);
            }
            count++;
            console.log(count);
            console.log('outputs: '+JSON.stringify(outputs));
            if (count == servers.length)
                res.send(JSON.stringify(outputs));
        });
    }
});

router.get('/courses/:id', function(req, res, next) {
    var server = config.find('courses', req.params.id[1]);
    var serverlist = server.split(':');
    sign.finds(req, res, serverlist[0], serverlist[1]);
});

router.post('/course/:key', function(req, res, next) {
    var server = config.find('courses', req.body.id[1]);
    console.log(server);
    var serverlist = server.split(':');
    sign.finds(req,res,serverlist[0],serverlist[1]);
});

/*router.post('/findCourses', function(req, res, next) {
    var server = config.find('courses', req.body.name[0]);
    var serverlist = server.split(':');
    sign.finds(req,res,serverlist[0],serverlist[1]);
});*/

router.put('/addStudentToCourse/:key', function(req, res, next) {
    var server = config.find('students', req.body.stu[1]);
    var serverlist = server.split(':');
    sign.findSpecific(req, res, serverlist[0], serverlist[1], 
    '/addCourseToStudent/'+req.body.stu+'/'+req.params.key,
    function(data){
        var jsonObj=JSON.parse(data);
        if ("RET" in jsonObj && jsonObj["RET"]==200) {
            server = config.find('courses', req.body.courses[1]);
            serverlist = server.split(':');
            sign.findSpecific(req, res, serverlist[0], serverlist[1],
            '/addStudentToCourse/'+req.body.courses+'/'+req.params.key,
            function(data1){
                var jsonObj1=JSON.parse(data1);
                if ("RET" in jsonObj1 && jsonObj["RET"]==200) {
                    res.send(JSON.stringify({ RET:200,status:"success" }));
                }
                else {
                    sign.findSpecific(req, res, serverlist[0], serverlist[1], 
                    '/deleteCourseFromStudent/'+req.body.stu+'/'+req.params.key,
                    function(newdata){
                        res.send(data1);
                    });
                }
            });
            
        }
        else {
            res.send(data);
        }
    });
});

router.put('/course/:id/:key', function(req, res, next) {
    var server = config.find('courses', req.params.id[1]);
    var serverlist = server.split(':');
    sign.finds(req,res,serverlist[0],serverlist[1]);
});

router.delete('/course/:id/:key', function(req, res, next) {
    var server = config.find('courses', req.params.id[1]);
    var serverlist = server.split(':');
    sign.finds(req,res,serverlist[0],serverlist[1]);
});

router.put('/deleteStudentFromCourse/:key', function(req, res, next) {
    var server = config.find('students', req.body.stu[1]);
    var serverlist = server.split(':');
    sign.findSpecific(req, res, serverlist[0], serverlist[1], 
    '/deleteCourseFromStudent/'+req.body.stu+'/'+req.params.key,
    function(data){
        var jsonObj=JSON.parse(data);
        if ("RET" in jsonObj && jsonObj["RET"]==200) {
        console.log('seccess in part 1');
            server = config.find('courses', req.body.courses[1]);
            serverlist = server.split(':');
            sign.findSpecific(req, res, serverlist[0], serverlist[1],
            '/deleteStudentFromCourse/'+req.body.courses+'/'+req.params.key,
            function(data1){
                var jsonObj1=JSON.parse(data1);
                if ("RET" in jsonObj1 && jsonObj["RET"]==200) {
                    res.send(JSON.stringify({ RET:200,status:"success" }));
                }
                else {
                    sign.findSpecific(req, res, serverlist[0], serverlist[1], 
                    '/addCourseToStudent/'+req.body.stu+'/'+req.params.key,
                    function(newdata){
                        res.send(data1);
                    });
                }
            });
            
        }
        else {
            res.send(data);
        }
    });
});

router.get('/students', function(req, res, next) {
    var outputs = [];
    var count = 0;
    var servers = config.getServerList('students');
    console.log(servers);
    for(var index = 0; index < servers.length; index++) {
        var serverlist = servers[index].split(':');
        sign.findwithCallback(req, res, serverlist[0], serverlist[1],
        function(data){
            jsonObj = JSON.parse(data);
            for(var i=0,size=jsonObj.length;i<size;i++){
                var record=jsonObj[i];
                outputs.push(record);
            }
            count++;
            console.log(count);
            console.log('outputs: '+JSON.stringify(outputs));
            if (count == servers.length)
                res.send(JSON.stringify(outputs));
        });
    }
});

router.get('/students/:id', function(req, res, next) {
    console.log('haha');
    var server = config.find('students', req.params.id[1]);
    var serverlist = server.split(':');
    sign.finds(req, res, serverlist[0], serverlist[1]);
});

router.post('/student/:key', function(req, res, next) {
    var server = config.find('students', req.body.id[1]);
    var serverlist = server.split(':');
    sign.finds(req, res, serverlist[0], serverlist[1]);
});

router.put('/student/:id/:key', function(req, res, next) {
    var server = config.find('students', req.params.id[1]);
    var serverlist = server.split(':');
    sign.finds(req, res, serverlist[0], serverlist[1]);
});

router.delete('/student/:id/:key', function(req, res, next) {
    var server = config.find('students', req.params.id[1]);
    var serverlist = server.split(':');
    sign.finds(req, res, serverlist[0], serverlist[1]);
});

/*router.post('/findStudents', function(req, res, next) {
    var server = config.find('students', req.body.name[0]);
    var serverlist = server.split(':');
    sign.finds(req,res,serverlist[0],serverlist[1]);
});*/
//DataModel change & Partition
router.put('/addStudentAttribute/:key', function(req, res, next) {
    var attributeToadd = req.body.attribute;
    var output = '';
    var servers = config.getServerList('students');
    for(var index = 0; index < servers.length; index++) {
        var serverlist = servers[index].split(':');
        sign.findforDataModel(req, res, serverlist[0], serverlist[1], '/addStudentAttribute/'+req.params.key);
    }
    res.send(JSON.stringify({ RET:200,status:"success" }));
});

router.put('/deleteStudentAttribute/:key', function(req, res, next) {
    var output = '';
    var servers = config.getServerList('students');
    for(var index = 0; index < servers.length; index++) {
        var serverlist = servers[index].split(':');
        sign.findforDataModel(req, res, serverlist[0], serverlist[1], '/deleteStudentAttribute/'+req.params.key);
    }
    res.send(JSON.stringify({ RET:200,status:"success" }));
});
router.put('/addCourseAttribute/:key', function(req, res, next) {
    var output = '';
    var servers = config.getServerList('courses');
    for(var index = 0; index < servers.length; index++) {
        var serverlist = servers[index].split(':');
        sign.findforDataModel(req, res, serverlist[0], serverlist[1], '/addCourseAttribute/'+req.params.key);
    }
    res.send(JSON.stringify({ RET:200,status:"success" }));
});

router.put('/deleteCourseAttribute/:key', function(req, res, next) {
    var output = '';
    var servers = config.getServerList('courses');
    for(var index = 0; index < servers.length; index++) {
        var serverlist = servers[index].split(':');
        sign.findforDataModel(req, res, serverlist[0], serverlist[1], '/deleteCourseAttribute/'+req.params.key);
    }
    res.send(JSON.stringify({ RET:200,status:"success" }));
});

router.get('/studentsPartition', function(req, res, next) {
    var servers = config.getServerParitition('students');
    res.send(servers);
});

router.post('/studentsPartition/:splitChars/:key', function(req, res, next) {
    var servers = config.getServerParitition('students');
    var splitChars = req.params.splitChars;
    var num = servers.length;
    if (splitChars.length/2.0 > num)
        res.send(JSON.stringify({ RET:400,status:"bad request",info:"The length should be twice as the number of available servers." }));
    else if (splitChars.length/2.0 < num)
        res.send(JSON.stringify({ RET:400,status:"bad request",info:"The length should be twice as the number of available servers." }));
    else if (splitChars[0] != '0' || splitChars[splitChars.length-1] != '9')
        res.send(JSON.stringify({ RET:400,status:"bad request",info:"The first should be 0 and the last should be 9." }));
    else {
        var list = new Array();
        var studentservers = config.getServerList('students');
        config.setPartition('students',splitChars);
        
        for(var index = 0; index < studentservers.length; index++) {
            var serverlist = studentservers[index].split(':');
            sign.findforPartition(req, res, serverlist[0], serverlist[1],
                '/student/repartition/'+req.params.key,
                splitChars[index*2],splitChars[index*2+1],function(data){
                    var jsonObj=JSON.parse(data);
                    console.log(JSON.stringify(jsonObj));
                    for(var i=0,size=jsonObj.length;i<size;i++){
                        var record=jsonObj[i];
                        var server = config.find('students', record.id[1]);
                        var serverlist2 = server.split(':');
                        sign.findforResendData(req, res, serverlist2[0], serverlist2[1],'/student/teacher',record);
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

router.post('/coursesPartition/:splitChars/:key', function(req, res, next) {
    var servers = config.getServerParitition('courses');
    var splitChars = req.params.splitChars;
    var num = servers.length;
    if (splitChars.length/2.0 > num)
        res.send(JSON.stringify({ RET:400,status:"bad request",info:"The length should be twice as the number of available servers." }));
    else if (splitChars.length/2.0 < num)
        res.send(JSON.stringify({ RET:400,status:"bad request",info:"The length should be twice as the number of available servers." }));
    else if (splitChars[0] != '0' || splitChars[splitChars.length-1] != '9')
        res.send(JSON.stringify({ RET:400,status:"bad request",info:"The first should be 0 and the last should be 9." }));
    else {
        var list = new Array();
        var courseservers = config.getServerList('courses');

        config.setPartition('courses',splitChars);
        
        for(var index = 0; index <courseservers.length; index++) {
            var serverlist = courseservers[index].split(':');
            sign.findforPartition(req, res, serverlist[0], serverlist[1],
                '/course/repartition/'+req.params.key,
                splitChars[index*2],splitChars[index*21],function(data){
                var jsonObj=JSON.parse(data);
                for(var i=0,size=jsonObj.length;i<size;i++){
                    var record=jsonObj[i];
                    var server = config.find('courses', record.id[1]);
                    var serverlist2 = server.split(':');                   
                    sign.findforResendData(req, res, serverlist2[0], serverlist2[1],'/course/teacher',record);
                }
            });
        }
    }
    res.send(JSON.stringify({ RET:200,status:"success" }));
});
module.exports = router;

