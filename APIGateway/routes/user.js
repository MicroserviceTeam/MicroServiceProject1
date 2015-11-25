var express = require('express');
var router = express.Router();
var sign = require('../sign');
var config = require('../config');
var mongo = require('mongoskin');

router.get('/courses', function(req, res, next) {
    
    var outputs = [];
    var count = 0;
    var servers = config.getServerList('courses');
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
            if (count == servers.length){
                res.send(JSON.stringify(outputs));
                config.Partition();
            }
        });
    }
});

router.get('/courses/:id', function(req, res, next) {
    
    var server = config.find('courses', req.params.id[1]);
    var serverlist = server.split(':');
    sign.finds(req, res, serverlist[0], serverlist[1]);
});

router.put('/courses/:id', function(req, res, next) {
    var server = config.find('courses', req.params.id[1]);
    var serverlist = server.split(':');
    sign.finds(req,res,serverlist[0], serverlist[1]);
});

/*router.post('/findCourses', function(req, res, next) {
    var server = config.find('courses', req.body.name[0]);
    var serverlist = server.split(':');
    sign.finds(req,res,serverlist[0],serverlist[1]);
});*/

router.post('/courses', function(req, res, next) {
    var server = config.find('courses', req.body.id[1]);
    var serverlist = server.split(':');
    sign.finds(req,res,serverlist[0],serverlist[1]);
});

router.post('/courses/:cid/students/:sid', function(req, res, next) {
    //config.Partition();
    var server = config.find('students', req.params.sid[1]);
    var serverlist = server.split(':');
    sign.findSpecific(req, res, serverlist[0], serverlist[1], req.method,
	'/students/'+req.params.sid+'/courses/'+req.params.cid,
	function(data){
		var jsonObj=JSON.parse(data);
		if ("RET" in jsonObj && jsonObj["RET"]==200) {
			server = config.find('courses', req.params.cid[1]);
			serverlist = server.split(':');
			sign.findSpecific(req, res, serverlist[0], serverlist[1], req.method,
			'/courses/'+req.params.cid+'/students/'+req.params.sid,
			function(data1){
				var jsonObj1=JSON.parse(data1);
				if ("RET" in jsonObj1 && jsonObj["RET"]==200) {
					res.send(JSON.stringify({ RET:200,status:"success" }));
                    config.Partition();
				}
				else {
					sign.findSpecific(req, res, serverlist[0], serverlist[1], 'DELETE', 
					'/students/'+req.params.sid+'/courses/'+req.params.cid,
					function(newdata){
						res.send(data1);
                        config.Partition();
					});
				}

			});
			
		}
		else {
			res.send(data);
            config.Partition();
		}
	});
});

router.delete('/courses/:id', function(req, res, next) {
    if(req.params.id=='models'){
        var servers = config.getServerList('courses');
        for(var index = 0; index < servers.length; index++) {
            var serverlist = servers[index].split(':');
            sign.findforDataModel(req, res, serverlist[0], serverlist[1], '/courses/models');
        }
        res.send(JSON.stringify({ RET:200,status:"success" }));
    }else{
        var server = config.find('courses', req.params.id[1]);
        var serverlist = server.split(':');
        sign.finds(req,res,serverlist[0],serverlist[1]);
    }
});

router.delete('/courses/:cid/students/:sid', function(req, res, next) {
    //config.Partition();
	var server = config.find('students', req.params.sid[1]);
    var serverlist = server.split(':');
    sign.findSpecific(req, res, serverlist[0], serverlist[1], req.method,
    '/students/'+req.params.sid+'/courses/'+req.params.cid,
    function(data){
        var jsonObj=JSON.parse(data);
        if ("RET" in jsonObj && jsonObj["RET"]==200) {
            server = config.find('courses', req.params.cid[1]);
            serverlist = server.split(':');
            sign.findSpecific(req, res, serverlist[0], serverlist[1], req.method,
            '/courses/'+req.params.cid+'/students/'+req.params.sid,
            function(data1){
                var jsonObj1=JSON.parse(data1);
                if ("RET" in jsonObj1 && jsonObj["RET"]==200) {
                    res.send(JSON.stringify({ RET:200,status:"success" }));
                    config.Partition();
                }
                else {
                    sign.findSpecific(req, res, serverlist[0], serverlist[1], 'POST', 
                    '/students/'+req.params.sid+'/courses/'+req.params.cid,
                    function(newdata){
                        res.send(data1);
                        config.Partition();
                    });
                }
            });
            
        }
        else {
            res.send(data);
            config.Partition();
        }
    });
});

router.post('/servers', function(req, res, next) {
    if(req.body.category==null || req.body.server==null) {
        res.send(JSON.stringify({ RET:400,status:"Wrong JSON format, must have category and server parameters." }));
        config.Partition();
        return;
    }
    config.addServer(req.body.category, req.body.server);
    res.send(JSON.stringify({ RET:200,status:"Success" }));
    config.Partition();
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
            if (count == servers.length){
                res.send(JSON.stringify(outputs));
                config.Partition();
            }
        });
    }
});


router.get('/students/:id', function(req, res, next) {
    var server = config.find('students', req.params.id[1]);
    var serverlist = server.split(':');
    sign.finds(req, res, serverlist[0], serverlist[1]);
});

router.post('/students', function(req, res, next) {
    var server = config.find('students', req.body.id[1]);
    var serverlist = server.split(':');
    sign.finds(req, res, serverlist[0], serverlist[1]);
});

router.put('/students/:id', function(req, res, next) {
    var server = config.find('students', req.params.id[1]);
    var serverlist = server.split(':');
    sign.finds(req, res, serverlist[0], serverlist[1]);
});

router.delete('/students/:id/', function(req, res, next) {
    if(req.params.id=='models'){
        var servers = config.getServerList('students');
        for(var index = 0; index < servers.length; index++) {
            var serverlist = servers[index].split(':');
            sign.findforDataModel(req, res, serverlist[0], serverlist[1], '/students/models');
        }
        res.send(JSON.stringify({ RET:200,status:"success" }));        
    }else{
        var server = config.find('students', req.params.id[1]);
        var serverlist = server.split(':');
        sign.finds(req, res, serverlist[0], serverlist[1]);
    }
});

/*router.post('/findStudents', function(req, res, next) {
    var server = config.find('students', req.body.name[0]);
    var serverlist = server.split(':');
    sign.finds(req,res,serverlist[0],serverlist[1]);
});*/
//DataModel change & Partition
router.post('/students/models', function(req, res, next) {
    var servers = config.getServerList('students');
    for(var index = 0; index < servers.length; index++) {
        var serverlist = servers[index].split(':');
        sign.findforDataModel(req, res, serverlist[0], serverlist[1], '/students/models');
    }
    res.send(JSON.stringify({ RET:200,status:"success" }));
});

/*router.delete('/students/models', function(req, res, next) {
    config.Partition();
	var servers = config.getServerList('students');
    for(var index = 0; index < servers.length; index++) {
        var serverlist = servers[index].split(':');
        sign.findforDataModel(req, res, serverlist[0], serverlist[1], '/students/models');
    }
    res.send(JSON.stringify({ RET:200,status:"success" }));
});*/
router.post('/courses/models', function(req, res, next) {
    var servers = config.getServerList('courses');
    for(var index = 0; index < servers.length; index++) {
        var serverlist = servers[index].split(':');
        sign.findforDataModel(req, res, serverlist[0], serverlist[1], '/courses/models');
    }
    res.send(JSON.stringify({ RET:200,status:"success" }));
});

/*router.delete('/courses/models', function(req, res, next) {
    config.Partition();
    var servers = config.getServerList('courses');
    for(var index = 0; index < servers.length; index++) {
        var serverlist = servers[index].split(':');
        sign.findforDataModel(req, res, serverlist[0], serverlist[1], '/courses/models');
    }
    res.send(JSON.stringify({ RET:200,status:"success" }));
});*/


/*router.post('/studentsPartition/:splitChars', function(req, res, next) {
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
                '/students/repartition',
                splitChars[index*2],splitChars[index*2+1],function(data){
                    var jsonObj=JSON.parse(data);
                    console.log(JSON.stringify(jsonObj));
                    for(var i=0,size=jsonObj.length;i<size;i++){
                        var record=jsonObj[i];
                        var server = config.find('students', record.id[1]);
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
                '/courses/repartition',
                splitChars[index*2],splitChars[index*2+1],function(data){
                var jsonObj=JSON.parse(data);
                for(var i=0,size=jsonObj.length;i<size;i++){
                    var record=jsonObj[i];
                    var server = config.find('courses', record.id[1]);
                    console.log(record);
                    var serverlist2 = server.split(':');                   
                    sign.findforResendData(req, res, serverlist2[0], serverlist2[1],'/s',record);
                }
            });
        }
    }
    res.send(JSON.stringify({ RET:200,status:"success" }));
});*/
module.exports = router;

