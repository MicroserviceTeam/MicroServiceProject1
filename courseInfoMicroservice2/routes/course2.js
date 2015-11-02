var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
var dbCourse = mongo.db("mongodb://jingxiao:jingxiao@ds041154.mongolab.com:41154/course", {native_parser:true});
var collectionName = "course2";

router.get('/courses/:name', function(req, res, next) {
	dbCourse.collection(collectionName).find({'name': req.params.name}).toArray(function (err, result) {
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

router.get('/courses/:id', function(req, res, next) {
	dbCourse.collection(collectionName).find({'id': req.params.id}).toArray(function (err, result) {
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

router.post('/findCourse', function(req, res, next){
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

router.post('/courses', function(req, res, next) {
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
			"open": open
		};
		dbCourse.collection(collectionName).insert(obj, function (err, result) {
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

router.put('/addStudentToCourse/:id', function(req, res, next) {
	var addedStu = req.body.stu;
	if (req.params.id == null || addedStu == null)
		res.send(JSON.stringify({ RET: 402, status: "wrong JSON format" }));
	var oriStu;
	dbCourse.collection(collectionName).find({"id": req.params.id}).toArray(function (err, result) {
		if (err) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 500, status: "internal error"}));
		} else if (result.length == 0) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 400, status: "course not found"}));
		}
		else {
			oriStu = result.stu;
		}
	});
	for (var i in addedStu) {
		var flag = true;
		for (var j in oriStu) {
			if (addedStu[i] == oriStu[j]) {
				flag = false;
				break;
			}
			if (flag) oriStu.push(addedStu[i]);
		}

	}
	dbCourse.collection(collectionName).update({"id": req.params.id}, {
		$set: {"stu": oriStu}
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

router.delete('/deleteCourse/:id', function(req, res, next) {
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

router.delete('/deleteStudentFromCourse/:id', function(req, res, next) {
	var delStu = res.body.id;
	if (req.params.id == null || delStu == null) {
		res.send(JSON.stringify({ RET:402,status:"wrong JSON format" }));
	}
	var oriStu;
	dbCourse.collection(collectionName).find({"id": req.params.id}).toArray(function (err, result) {
		if (err) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 500, status: "internal error"}));
		} else if (result.length == 0) {
			res.contentType('json');
			res.send(JSON.stringify({RET: 400, status: "course not found"}));
		}
		else {
			oriStu = result.stu;
		}
	});
	if (oriStu == null) {
		res.contentType('json');
		res.send(JSON.stringify({RET: 500, status: "internal error"}));
	}

	for (var i in oriStu) {
		for (var j in delStu) {
			if (oriStu[i] == oriStu[j]) {
				oriStu.splice(i, 1);
			}
		}
	}
	dbCourse.collection(collectionName).update({"id": req.params.id}, {
		$set: {"stu": oriStu}
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
