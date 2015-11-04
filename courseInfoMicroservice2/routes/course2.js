/**
 * Created by jingxiaogu on 11/01/15.
 */
var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
var db = mongo.db("mongodb://jingxiao:jingxiao@ds041154.mongolab.com:41154/course", {native_parser:true});
var collectionName = "course2";
var fs = require('fs');
var logFile = './logfile.log'

function getDateTime() {
	var date = new Date();
	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;
	var min  = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;
	var sec  = date.getSeconds();
	sec = (sec < 10 ? "0" : "") + sec;
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	month = (month < 10 ? "0" : "") + month;
	var day  = date.getDate();
	day = (day < 10 ? "0" : "") + day;
	return hour + ":" + min + ":" + sec + " " + month + "/" + day + "/" + year;

}

//Add a new course
router.post('/course/:key', function(req, res, next) {
	var key = req.params.key;
	if (key != "teacher") {
		res.send("Must have teacher permission");
		return;
	}
	var addCourse = function () {
		db.collection(collectionName).find({"id": req.body.id}).toArray(function (err, result) {
			if (err) {
				res.contentType('json');
				res.send(JSON.stringify({RET: 500, status: "internal error"}));
                console.log(req.body.id);
			}
			else if (result.length != 0) {
				res.contentType('json');
				res.send(JSON.stringify({RET: 400, status: "course already exist"}));
			}
			else {
				var id = req.body.id;
				var name = req.body.name;
				var location = req.body.location;
				var desc = req.body.desc;
				var stu = req.body.stu;
				var credit = req.body.credit;
				var time = req.body.time;
				var approval = req.body.approval;
				var instructor = req.body.instructor;
				var website = req.body.website;
				var dept = req.body.dept;
				var open = req.body.open;
				if (id == null || name == null) {
					res.send(JSON.stringify({ RET:402,status:"wrong JSON format" }));
				}
				else {
					var obj = {
						"id": id,
						"name": name,
						"location": location,
						"desc": desc,
						"stu": stu,
						"credit": credit,
						"time": time,
						"approval": approval,
						"instructor": instructor,
						"website": website,
						"dept": dept,
						"open": open,
						"lastModifiedTime": getDateTime()
					};
					console.log(obj);
					db.collection(collectionName).insert(obj, function (err, result) {
						if(err) {
							res.contentType('json');
							res.send(JSON.stringify({ RET:500,status: "internal error"}));
						}
						else {
							logs = JSON.stringify({id:req.body.id,oldData:"None",newData:JSON.stringify(obj),version:getDateTime()});
							fs.appendFile(logFile, logs+"\n",
                            function(err) {
                                if(err) throw err;
                            });
							res.contentType('json');
							res.send(JSON.stringify({ RET:200,status:"success"}));
						}
					})
				}
			}
		});
	}
	addCourse();
});

//modify a course's information
router.put('/course/:id/:key', function(req, res, next) {
	var key = req.params.key;
	if (key != "teacher") {
		res.send("Must have teacher permission");
		return;
	}
	var id = req.params.id;
	var body = req.body;
	body["lastModifiedTime"] = getDateTime();
	originData = '';
	db.collection(collectionName).find({"id": req.params.id}).toArray(function (err, result) {
		if (err) {
			originData = "None.";
		} else if (result.length == 0) {
			originData = "None.";
		}
		else {
			originData = result;
		}
	});
	db.collection(collectionName).update(
		{"id": id},
		{$set: body},
		function (err, result) {
			console.log(JSON.stringify(result));
			if (err) {
				res.contentType('json');
				res.send(JSON.stringify({RET: 500, status: "internal error"}));
			}
			else if (result == 0) {
				res.contentType('json');
				res.send(JSON.stringify({RET: 400, status: "course not found"}));
			}
			else {
				logs = JSON.stringify({id:req.params.id,oldData:JSON.stringify(originData),newData:JSON.stringify(req.body),version:getDateTime()});
				fs.appendFile(logFile, logs+"\n", 
                function(err) {
                    if(err) throw err;
                });
				res.contentType('json');
				res.send(JSON.stringify({RET: 200, status: "success"}));
			}
		});
});


//get a course's information by name
router.get('/courseByName/:name', function(req, res, next) {
	var name = req.params.name;
	db.collection(collectionName).find({"name": name}).toArray(function (err, result) {
		if (err) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 500, status: "internal error"}));
		} else if (result.length == 0) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 400, status: "course not found"}));
		}
		else {
			res.json(result);
		}
	});
});

//get a course's information by id
router.get('/courses/:id', function(req, res, next) {
	db.collection(collectionName).find({'id': req.params.id}).toArray(function (err, result) {
		if (err) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 500, status: "internal error"}));
		} else if (result.length == 0) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 400, status: "course not found"}));
		}
		else {
			res.json(result);
		}
	});
});

//get a course's list
router.get('/courses', function(req, res, next) {
	db.collection(collectionName).find().toArray(function (err, result) {
		if (err) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 500, status: "internal error"}));
		} 
		else {
			res.json(result);
		}
	});
});

//delete a course by id
router.delete('/course/:id/:key', function(req, res, next) {
	var key = req.params.key;
	if (key != "teacher") {
		res.send("Must have teacher permission");
		return;
	}
	originData = '';
	db.collection(collectionName).find({"id": req.params.id}).toArray(function (err, result) {
		if (err) {
			originData = "None.";
		} else if (result.length == 0) {
			originData = "None.";
		}
		else {
			originData = result;
		}
	});
	db.collection(collectionName).remove({"id": req.params.id}, function (err, result) {
		console.log(JSON.stringify(result));
		if (err) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 500, status: "internal error"}));
		}
		else if (result == 0) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 400, status: "course not found"}));
		}
		else {
			logs = JSON.stringify({id:req.params.id,oldData:JSON.stringify(originData),newData:"None",version:getDateTime()});
			fs.appendFile(logFile, logs+"\n",
            function(err) {
                if(err) throw err;
            });
			res.contentType('json');
			res.send(JSON.stringify({RET: 200, status: "success"}));
		}
	});
});

//delete a student by name
router.delete('/courseByName/:name/:key', function(req, res, next) {
	var key = req.params.key;
	if (key != "teacher") {
		res.send("Must have teacher permission");
		return;
	}
	var name = req.params.name;
	db.collection(collectionName).remove({"name": name}, function (err, result) {
		if (err) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 500, status: "internal error"}));
		}
		else if (result == 0) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 400, status: "course not found"}));
		}
		else {
			res.contentType('json');
			res.send(JSON.stringify({RET: 200, status: "success"}));
		}
	});
});

//add students to courses
router.put('/addStudentToCourse/:id/:key', function(req, res, next) {
	var key = req.params.key;
	if (key != "teacher") {
		res.send("Must have teacher permission");
		return;
	}
	var addedStudents = req.body.stu.split(",");
	if (req.params.id == null || addedStudents == null) {
		res.send(JSON.stringify({RET: 402, status: "wrong JSON format"}));
		return;
	}
	var findStudent = function (callback) {
		db.collection(collectionName).find({"id": req.params.id}).toArray(function (err, result) {
			if (err) {
				res.contentType('json');
				res.send(JSON.stringify({RET: 500, status: "internal error"}));
				return;
			} else if (result.length == 0) {
				res.contentType('json');
				res.send(JSON.stringify({RET: 400, status: "course not found"}));
				return;
			}
			var oriStudents = result[0].stu.split(",");
			callback(oriStudents);
		});
	}

	findStudent(function (oriStudents) {
		for (var i in addedStudents) {
			if (oriStudents.indexOf(addedStudents[i]) == -1)
				oriStudents.push(addedStudents[i]);
		}
		db.collection(collectionName).update(
			{"id": req.params.id},
			{
				$set: {
					"stu": oriStudents.toString(),
					"lastModifiedTime": getDateTime()
				}
			},
			function (err, result) {
				if (err) {
					res.contentType('json');
					res.send(JSON.stringify({RET: 500, status: "internal error"}));
				}
				else {
					res.contentType('json');
					res.send(JSON.stringify({RET: 200, status: "success"}));
				}
			});
	});
});

//delete students from courses
router.put('/deleteStudentFromCourse/:id/:key', function(req, res, next) {
	var key = req.params.key;
	if (key != "teacher") {
		res.send("Must have teacher permission");
		return;
	}
	var delStudents = req.body.stu.split(",");
	if (req.params.id == null || delStudents == null) {
		res.send(JSON.stringify({ RET:402,status:"wrong JSON format" }));
		return;
	}
	var findStudent = function (callback) {
		db.collection(collectionName).find({"id": req.params.id}).toArray(function (err, result) {
			if (err) {
				res.contentType('json');
				res.send(JSON.stringify({RET: 500, status: "internal error"}));
				return;
			} else if (result.length == 0) {
				res.contentType('json');
				res.send(JSON.stringify({RET: 400, status: "course not found"}));
				return;
			}
			var oriStudents = result[0].stu.split(",");
			if (oriStudents == null) {
				res.contentType('json');
				res.send(JSON.stringify({RET: 500, status: "internal error"}));
				return;
			}
			callback(oriStudents);
		});
	}

	findStudent(function (oriStudents) {
		for (var i in delStudents) {
			var index = oriStudents.indexOf(delStudents[i]);
			if (index != -1)
				oriStudents.splice(index, 1);
		}
		db.collection(collectionName).update({"id": req.params.id},
			{
				$set: {
					"stu": oriStudents.toString(),
					"lastModifiedTime": getDateTime()
				}
			},
			function (err, result) {
				if (err) {
					res.contentType('json');
					res.send(JSON.stringify({RET: 500, status: "internal error"}));
				}
				else {
					res.contentType('json');
					res.send(JSON.stringify({RET: 200, status: "success"}));
				}
			}
		);
	})
});

//change data model
router.put('/addCourseAttribute/:key', function(req, res, next) {
	var key = req.params.key;
	if (key != "root") {
		res.send("Must have root permission");
		return;
	}
	var body = req.body;
	body["lastModifiedTime"] = getDateTime();
	db.collection(collectionName).update(
		{},
		{$set: body},
		{upsert:false, multi:true},
		function(err, result) {
			if (err) {
				res.contentType('json');
				res.send(JSON.stringify({ RET:500,status:"internal error" }));
			}
			else {
				res.contentType('json');
				res.send(JSON.stringify({ RET:200,status:"success"}));
			}
		}
	);
});

//delete data model
router.put('/deleteCourseAttribute/:key', function(req, res, next) {
	var key = req.params.key;
	if (key != "root") {
		res.send("Must have root permission");
		return;
	}
	var body = req.body;
	body["lastModifiedTime"] = getDateTime();
	db.collection(collectionName).update(
		{},
		{$unset: body},
		{upsert:false, multi:true},
		function(err, result) {
			if (err) {
				res.contentType('json');
				res.send(JSON.stringify({ RET:500,status:"internal error" }));
			}
			else {
				res.contentType('json');
				res.send(JSON.stringify({ RET:200,status:"success"}));
			}
		}
	);
});

//data repartition
router.post('/course/repartition/:key', function(req, res, next) {
	var key = req.params.key;
	if (key != "root") {
		res.send("Must have root permission");
		return;
	}
	var result = [];
	var newS = req.body.newStart.toLowerCase();
	var newE = req.body.newEnd.toLowerCase();
	var cursor = db.collection(collectionName).find();
	var filter = function (cb){
		cursor.toArray(function(err, array) {
			async.each(array, function(data, callback) {
				if (data == null) callback("err");
				else {
					var letter = data.id.substring(1, 2).toLowerCase();
					if (letter < newS || letter > newE) {
						result.push(data);
					}
					callback();
				}
			}, function(err) {
				if (err) throw err;
				else cb(null, result);
			});
		});
	}
	filter(function(err, result) {
		for(var i=0;i<result.length;i++){
			db.collection(collectionName).remove({"id": result[i].id}, function (err, results) {
		        if (err) {
			        console.log(JSON.stringify({RET: 500, status: "internal error"}));
		        }
		        else {
			        console.log(JSON.stringify(results));
		        }
	        });
		}
		console.log('result: ');
		console.log(JSON.stringify(result));
		res.send(result);
	});

});

//server status and number of elements in DB
router.get('/course/status', function(req, res, next) {
	db.collection(collectionName).count(function (err, result) {
		var obj = {
			"status": "running",
			"number": result
		};
		res.send(obj);
	});
});


module.exports = router;
