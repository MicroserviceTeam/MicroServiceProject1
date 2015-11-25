/**
 * Created by jingxiaogu on 11/01/15.
 */
var express = require('express');
var async = require("async");
var mongo = require('mongoskin');
var router = express.Router();
var db = mongo.db("mongodb://jingxiao:jingxiao@ds041144.mongolab.com:41144/student", {native_parser:true});
var collectionName = "student3";
var fs = require('fs');
var logFile = './logfile.log';

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

//add a new student
router.post('/students', function(req, res, next) {
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
                        logs = JSON.stringify({id:req.body.id,oldData:"None",newData:JSON.stringify(obj),version:getDateTime()});
                        fs.appendFile(logFile, logs,
                            function(err) {
                                if(err) throw err;
                            });
                        res.contentType('json');
                        res.send(JSON.stringify({RET: 200, status: "success"}));
                    }
                })
            }
        }
    });
});


//modify a student's information
router.put('/students/:sid', function(req, res, next) {
        var id = req.params.sid;
        var body = req.body;
        body["lastModifiedTime"] = getDateTime();
        originData = '';
        db.collection(collectionName).find({"id": id}).toArray(function (err, result) {
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
                if (err) {
                    res.contentType('json');
                    res.send(JSON.stringify({RET: 500, status: "internal error"}));
                }
                else if (result == 0) {
                    res.contentType('json');
                    res.send(JSON.stringify({RET: 400, status: "student not found"}));
                }
                else {
                    logs = JSON.stringify({id:req.params.sid,oldData:JSON.stringify(originData),newData:JSON.stringify(req.body),version:getDateTime()});
                    fs.appendFile(logFile, logs+"\n",
                        function(err) {
                            if(err) throw err;
                        });
                    res.contentType('json');
                    res.send(JSON.stringify({RET: 200, status: "success"}));
                }
            });
    }
);


//get a student's information by id
router.get('/students/:sid', function(req, res, next) {
    db.collection(collectionName).find({'id': req.params.sid}).toArray(function (err, result) {
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

//get all students
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
router.delete('/students/:sid', function (req, res, next) {
    if (req.params.sid == 'models') {
        deleteDataModel(req, res, next);
    }
    else {
        originData = '';
        db.collection(collectionName).find({"id": req.params.sid}).toArray(function (err, result) {
            if (err) {
                originData = "None.";
            } else if (result.length == 0) {
                originData = "None.";
            }
            else {
                originData = result;
            }
        });
        db.collection(collectionName).remove({"id": req.params.sid}, function (err, result) {
            if (err) {
                res.contentType('json');
                res.send(JSON.stringify({RET: 500, status: "internal error"}));
            }
            else if (result == 0) {
                res.contentType('json');
                res.send(JSON.stringify({RET: 400, status: "student not found"}));
            }
            else {
                logs = JSON.stringify({
                    id: req.params.sid,
                    oldData: JSON.stringify(originData),
                    newData: "None",
                    version: getDateTime()
                });
                fs.appendFile(logFile, logs + "\n",
                    function (err) {
                        if (err) throw err;
                    });
                res.contentType('json');
                res.send(JSON.stringify({RET: 200, status: "success"}));
            }
        });
    }
});


//add courses to students
router.post('/students/:sid/courses/:cid', function (req, res, next) {
    var addedCourses = req.params.cid;
    console.log(addedCourses);
    if (req.params.sid == null || addedCourses == null) {
        res.send(JSON.stringify({RET: 402, status: "wrong JSON format"}));
        return;
    }
    var findCourse = function (callback) {
        db.collection(collectionName).find({"id": req.params.sid}).toArray(function (err, result) {
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
        if (oriCourses.indexOf(addedCourses) == -1)
            oriCourses.push(addedCourses);
        db.collection(collectionName).update(
            {"id": req.params.sid},
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
router.delete('/students/:sid/courses/:cid', function (req, res, next) {
    var delCourses = req.params.cid;
    if (req.params.sid == null || delCourses == null) {
        res.send(JSON.stringify({ RET:402,status:"wrong JSON format" }));
        return;
    }
    var findCourse = function (callback) {
        db.collection(collectionName).find({"id": req.params.sid}).toArray(function (err, result) {
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
        var index = oriCourses.indexOf(delCourses);
        if (index != -1)
            oriCourses.splice(index, 1);
        db.collection(collectionName).update({"id": req.params.sid},
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
router.post('/students/models', function(req, res, next) {
    var body = req.body;
    body["lastModifiedTime"] = getDateTime();
    console.log(body);
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

function deleteDataModel(req, res, next) {
    var body = req.body;
    body["lastModifiedTime"] = getDateTime();
    db.collection(collectionName).update(
        {},
        {$unset: body},
        {upsert: false, multi: true},
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
}

//data repartition
router.post('/students/partitions', function (req, res, next) {
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
router.get('/students/status', function(req, res, next) {
    db.collection(collectionName).count(function(err, result) {
        var obj = {
            "status": "running",
            "number": result
        };
        res.send(obj);
    });
});

module.exports = router;
