var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
var dbStudent = mongo.db("mongodb://jingxiao:jingxiao@ds041144.mongolab.com:41144/student", {native_parser:true});
var collectionName = "student2";

router.get('/student/:name', function(req, res, next) {
	dbStudent.collection(collectionName).find({'name': req.params.name}).toArray(function (err, result) {
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

router.get('/student/:id', function(req, res, next) {
	dbStudent.collection(collectionName).find({'id': req.params.id}).toArray(function (err, result) {
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


router.post('/findStudent', function(req, res, next){
	var condition = req.body;
	dbCourse.collection(collectionName).find(condition).toArray(function (err, result) {
		if (err) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 500, status: "internal error"}));
		}
		else if (result.length == 0) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 400, status: "course not found"}));
		}
		else res.json(result);
	});
});

router.post('/students', function(req, res, next) {
	var id = req.body.id;
	var name = req.body.name;
	var dept = req.body.dept;
	var prog = req.body.prog;
	var enrollTime = req.body.enrollTime;
	var gradTime = req.body.gradTime;
	var courses = req.body.enrollCourses;
	if (id == null || name == null) {
		res.send(JSON.stringify({ RET:402,status:"wrong JSON format" }));
	}
	else {
		var obj = {
			"id": id,
			"name": name,
			"dept": dept,
			"prog": prog,
			"enrollTime": enrollTime,
			"gradTime": gradTime,
			"courses": courses
		};
		dbStudent.collection(collectionName).insert(obj, function (err, result) {
			if(err) {
				res.contentType('json');
				res.send(JSON.stringify({ RET:500,status: "internal error"}));
			}
			else {
				res.contentType('json');
				res.send(JSON.stringify({ RET:200,status:"success"}));
			}
		})
	}
});

router.put('/addCourseToStudent/:id', function(req, res, next) {
	var addedCourses = req.body.courses;
	if (req.params.id == null || addedCourses == null)
		res.send(JSON.stringify({ RET: 402, status: "wrong JSON format" }));
	var oriCourses;
	dbStudent.collection(collectionName).find({"id": req.params.id}).toArray(function (err, result) {
		if (err) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 500, status: "internal error"}));
		} else if (result.length == 0) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 400, status: "course not found"}));
		}
		else {
			oriCourses = result.courses;
		}
	});
	for (var i in addedCourses) {
		var flag = true;
		for (var j in oriStu) {
			if (addedCourses[i] == oriCourses[j]) {
				flag = false;
				break;
			}
			if (flag) oriCourses.push(addedCourses);
		}

	}
	dbStudent.collection(collectionName).update({"id": req.params.id}, {
		$set: {"courses": oriCourses}
	}, false, false, function (err, result) {
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

router.delete('/deleteStudent/:id', function(req, res, next) {
	if (req.params.id == null)
		res.send(JSON.stringify({ RET:402,status:"wrong JSON format" }));
	else {
		db.collection(collectionName).remove({"id": req.params.id}, function (err, result) {
			if (err) {
				res.contentType('json');
				res.send(JSON.stringify({RET: 500, status: "internal error"}));
			} else {
				res.contentType('json');
				res.send(JSON.stringify({RET: 200, status: "success"}));
			}
		});
	}
});

router.delete('/deleteCourseFromStudent/:id', function(req, res, next) {
	var delCourses = res.body.id;
	if (req.params.id == null || delCourses == null) {
		res.send(JSON.stringify({ RET:402,status:"wrong JSON format" }));
	}
	var oriCourses;
	dbStudent.collection(collectionName).find({"id": req.params.id}).toArray(function (err, result) {
		if (err) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 500, status: "internal error"}));
		} else if (result.length == 0) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 400, status: "course not found"}));
		}
		else {
			oriCourses = result.courses;
		}
	});
	if (oriCourses == null) {
		res.contentType('json');
		res.send(JSON.stringify({RET: 500, status: "internal error"}));
	}

	for (var i in oriCourses) {
		for (var j in delCourses) {
			if (oriCourses[i] == delCourses[j]) {
				oriCourses.splice(i, 1);
			}
		}
	}
	dbStudent.collection(collectionName).update({"id": req.params.id}, {
		$set: {"courses": oriCourses}
	}, false, false, function (err, result) {
		if (err) {
			res.contentType('json');
			res.send(JSON.stringify({ RET:500,status:"internal error" }));
		}
		else {
			res.contentType('json');
			res.send(JSON.stringify({ RET:200,status:"success"}));
		}
	});

});
module.exports = router;
