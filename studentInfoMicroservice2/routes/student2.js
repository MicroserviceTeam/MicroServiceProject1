/**
 * Created by jingxiaogu on 11/01/15.
 */
var express = require('express');
var async = require("async");
var mongo = require('mongoskin');
var router = express.Router();
var db = mongo.db("mongodb://jingxiao:jingxiao@ds041144.mongolab.com:41144/student", {native_parser:true});
var collectionName = "student2";

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

//Add a new student
router.post('/student/:key', function(req, res, next) {
	var key = req.params.key;
	if (key != "teacher") {
		res.send("Must have teacher permission");
		return;
	}
	var addStudent = function() {
		db.collection(collectionName).find({"id": req.body.id}).toArray(function (err, result) {
			if (err) {
				res.contentType('json');
				res.send(JSON.stringify({RET: 500, status: "internal error"}));
			}
			else if (result.length != 0) {
				res.contentType('json');
				res.send(JSON.stringify({RET: 400, status: "student already exist"}));
			}
			else {
				var id = req.body.id;
				var firstname = req.body.firstname;
				var lastname = req.body.lastname;
				var dept = req.body.dept;
				var prog = req.body.prog;
				var enrollTime = req.body.enrollTime;
				var gradTime = req.body.gradTime;
				var courses = req.body.courses;
				if (id == null || firstname == null || lastname == null) {
					res.send(JSON.stringify({RET: 402, status: "wrong JSON format"}));
				}
				else {
					var obj = {
						"id": id,
						"firstname": firstname,
						"lastname": lastname,
						"dept": dept,
						"prog": prog,
						"enrollTime": enrollTime,
						"gradTime": gradTime,
						"courses": courses,
						"lastModifiedTime": getDateTime()
					};
					db.collection(collectionName).insert(obj, function (err, result) {
						if (err) {
							res.contentType('json');
							res.send(JSON.stringify({RET: 500, status: "internal error"}));
						}
						else {
							res.contentType('json');
							res.send(JSON.stringify({RET: 200, status: "success"}));
						}
					})
				}
			}
		});
	}
	addStudent();
});

//modify a student's information
router.put('/student/:id/:key', function(req, res, next) {
	var key = req.params.key;
	if (key != "teacher") {
		res.send("Must have teacher permission");
		return;
	}
	var id = req.params.id;
	var body = req.body;
	body["lastModifiedTime"] = getDateTime();
	db.collection(collectionName).update(
		{"id": id},
		{$set: body},
		function (err, result) {
			if (err) {
				res.contentType('json');
				res.send(JSON.stringify({RET: 500, status: "internal error"}));
			}
			else if (result == 0) {
				res.contentType('json');
				res.send(JSON.stringify({RET: 400, status: "student not found"}));
			}
			else {
				res.contentType('json');
				res.send(JSON.stringify({RET: 200, status: "success"}));
			}
		});
});


//get a student's information by name
router.get('/studentByName/:name', function(req, res, next) {
	var name = req.params.name.trim().split(" ");
	var firstname = name[0];
	var lastname = name[1];
	db.collection(collectionName).find({"firstname": firstname, "lastname": lastname}).toArray(function (err, result) {
		if (err) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 500, status: "internal error"}));
		} else if (result.length == 0) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 400, status: "student not found"}));
		}
		else {
			res.json(result);
		}
	});
});

//get a student's information by id
router.get('/students/:id', function(req, res, next) {
	db.collection(collectionName).find({'id': req.params.id}).toArray(function (err, result) {
		if (err) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 500, status: "internal error"}));
		} else if (result.length == 0) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 400, status: "student not found"}));
		}
		else {
			res.json(result);
		}
	});
});

//get a student's list
router.get('/students', function(req, res, next) {
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

//delete a student by id
router.delete('/student/:id/:key', function(req, res, next) {
	var key = req.params.key;
	if (key != "teacher") {
		res.send("Must have teacher permission");
		return;
	}
	db.collection(collectionName).remove({"id": req.params.id}, function (err, result) {
		if (err) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 500, status: "internal error"}));
		}
		else if (result == 0) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 400, status: "student not found"}));
		}
		else {
			res.contentType('json');
			res.send(JSON.stringify({RET: 200, status: "success"}));
		}
	});
});

//delete a student by name
router.delete('/studentByName/:name/:key', function(req, res, next) {
	var key = req.params.key;
	if (key != "teacher") {
		res.send("Must have teacher permission");
		return;
	}
	var name = req.params.name.trim().split(" ");
	var firstname = name[0];
	var lastname = name[1];
	db.collection(collectionName).remove({"firstname": firstname, "lastname": lastname}, function (err, result) {
		if (err) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 500, status: "internal error"}));
		}
		else if (result == 0) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 400, status: "student not found"}));
		}
		else {
			res.contentType('json');
			res.send(JSON.stringify({RET: 200, status: "success"}));
		}
	});
});

//add courses to students
router.put('/addCourseToStudent/:id/:key', function(req, res, next) {
	var key = req.params.key;
	if (key != "teacher") {
		res.send("Must have teacher permission");
		return;
	}
	var addedCourses = req.body.courses.split(",");
	if (req.params.id == null || addedCourses == null) {
		res.send(JSON.stringify({RET: 402, status: "wrong JSON format"}));
		return;
	}
	var findCourse = function (callback) {
		db.collection(collectionName).find({"id": req.params.id}).toArray(function (err, result) {
			if (err) {
				res.contentType('json');
				res.send(JSON.stringify({RET: 500, status: "internal error"}));
				return;
			} else if (result.length == 0) {
				res.contentType('json');
				res.send(JSON.stringify({RET: 400, status: "student not found"}));
				return;
			}
			var oriCourses = result[0].courses.split(",");
			callback(oriCourses);
		});
	}

	findCourse(function (oriCourses) {
		for (var i in addedCourses) {
			if (oriCourses.indexOf(addedCourses[i]) == -1)
				oriCourses.push(addedCourses[i]);
		}
		db.collection(collectionName).update(
			{"id": req.params.id},
			{
				$set: {
					"courses": oriCourses.toString(),
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

//delete courses from students
router.put('/deleteCourseFromStudent/:id/:key', function(req, res, next) {
	var key = req.params.key;
	if (key != "teacher") {
		res.send("Must have teacher permission");
		return;
	}
	var delCourses = req.body.courses.split(",");
	if (req.params.id == null || delCourses == null) {
		res.send(JSON.stringify({ RET:402,status:"wrong JSON format" }));
		return;
	}
	var findCourse = function (callback) {
		db.collection(collectionName).find({"id": req.params.id}).toArray(function (err, result) {
			if (err) {
				res.contentType('json');
				res.send(JSON.stringify({RET: 500, status: "internal error"}));
				return;
			} else if (result.length == 0) {
				res.contentType('json');
				res.send(JSON.stringify({RET: 400, status: "student not found"}));
				return;
			}
			var oriCourses = result[0].courses.split(",");
			if (oriCourses == null) {
				res.contentType('json');
				res.send(JSON.stringify({RET: 500, status: "internal error"}));
				return;
			}
			callback(oriCourses);
		});
	}

	findCourse(function (oriCourses) {
		for (var i in delCourses) {
			var index = oriCourses.indexOf(delCourses[i]);
			if (index != -1)
				oriCourses.splice(index, 1);
		}
		db.collection(collectionName).update({"id": req.params.id},
			{
				$set: {
					"courses": oriCourses.toString(),
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
router.put('/addStudentAttribute/:key', function(req, res, next) {
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
router.put('/deleteStudentAttribute/:key', function(req, res, next) {
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
router.post('/student/repartition/:key', function(req, res, next) {
	var key = req.params.key;
	if (key != "root") {
		res.send("Must have root permission");
		return;
	}
	var result = [];
	var oriS = req.body.oriStart.toLowerCase();
	var oriE = req.body.oriEnd.toLowerCase();
	var newS = req.body.newStart.toLowerCase();
	var newE = req.body.newEnd.toLowerCase();
	var cursor = db.collection(collectionName).find();
	var filter = function (cb){
		cursor.toArray(function(err, array) {
			async.each(array, function(data, callback) {
				if (data == null) callback("err");
				else {
					var letter = data.lastname.substring(0, 1).toLowerCase();
					if ((letter >= oriS && letter < newS) || (letter > newE && letter <= oriE)) {
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
		res.send(result);
	});

});

//server status and number of elements in DB
router.get('/student/status', function(req, res, next) {
	db.collection(collectionName).count(function(err, result) {
		var obj = {
			"status": "running",
			"number": result
		};
		res.send(obj);
	});
});

module.exports = router;
