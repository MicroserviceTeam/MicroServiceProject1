var fs=require('fs');
var sign = require('./sign');

var configFile = './config.json';
var configinUse = './routes/config.json';
exports.find = function(category,name) {
    //name = name.toUpperCase();
    data = fs.readFileSync(configinUse);
    var jsonObj=JSON.parse(data);
    
    for(var i=0,size=jsonObj.length;i<size;i++){
        var record=jsonObj[i];
        if (category == record['category'] && name >= record['start'] && name <= record['end']) {
            return record['server'];
        }
    }
};

exports.getServerList = function(category) {
    data = fs.readFileSync(configinUse);
    console.log(data);
    var jsonObj=JSON.parse(data);
    var list = new Array();
    for(var i=0,size=jsonObj.length;i<size;i++){
        var record=jsonObj[i];
        if (category == record['category'] ) {
            list.push(record['server'])
        }
    }
    return list;
};

exports.getoriStart = function(category) {
    data = fs.readFileSync(configinUse);
    var jsonObj=JSON.parse(data);
    var list = new Array();
    for(var i=0,size=jsonObj.length;i<size;i++){
        var record=jsonObj[i];
        if (category == record['category'] ) {
            list.push(record['start'])
        }
    }
    return list;
};exports.getoriEnd = function(category) {
    data = fs.readFileSync(configinUse);
    var jsonObj=JSON.parse(data);
    var list = new Array();
    for(var i=0,size=jsonObj.length;i<size;i++){
        var record=jsonObj[i];
        if (category == record['category'] ) {
            list.push(record['end'])
        }
    }
    return list;
};
exports.getServerParitition = function(category) {
    data = fs.readFileSync(configinUse);
    var jsonObj=JSON.parse(data);
    var list = new Array();
    for(var i=0,size=jsonObj.length;i<size;i++){
        var record=jsonObj[i];
        if (category == record['category'] ) {
            list.push(record)
        }
    }
    return list;
}

exports.setPartition = function(category,splitChars) {
    data = fs.readFileSync(configinUse);
    var jsonObj=JSON.parse(data);
    var list = new Array();
    var j=0;
    var size=jsonObj.length;
    for(var i=0;i<size;i++){
        var record=jsonObj[i];
        if (category == record['category'] ) {
            record['start'] = splitChars[j*2];
            record['end'] = splitChars[j*2+1];
            list.push(record);
            j++;
        }
        else {
            list.push(record);
        }
    }
    fs.writeFile(configinUse, JSON.stringify(list),
    function(err) {
        if(err) throw err;
    });
    return;
}

function compareObject(o1,o2){
  if(typeof o1 != typeof o2)return false;
  if(typeof o1 == 'object'){
    for(var o in o1){
      if(typeof o2[o] == 'undefined')return false;
      if(!compareObject(o1[o],o2[o]))return false;
    }
    return true;
  }else{
    return o1 === o2;
  }
}

exports.Partition = function() {
    data = fs.readFileSync(configFile);
    real_data = fs.readFileSync(configinUse);
    var jsonObj=JSON.parse(data);
    var realjsonObj=JSON.parse(real_data);
    if (compareObject(jsonObj,realjsonObj) == false) {
        fs.writeFileSync(configinUse, JSON.stringify(jsonObj)/*,
        function(err) {
            if(err) console.log('error happens when modifying config!');
        }*/);
        for(var index = 0; index <jsonObj.length; index++) {
            var record=jsonObj[index];
                server = record['server'];
                var serverlist = server.split(':');
                console.log('serverlist: '+serverlist);
                sign.findforPartition(serverlist[0], serverlist[1],
                '/'+record['category']+'/partitions',
                record['start'],record['end'],record['category'],function(category, data){
                    console.log('data: '+data);
                    var jsonObj1=JSON.parse(data);
                    for(var i=0,size=jsonObj1.length;i<size;i++){
                        var record1=jsonObj1[i];
                        var server = exports.find(category, record1.id[1]);
                        var serverlist2 = server.split(':');                   
                        sign.findforResendData(serverlist2[0], serverlist2[1],'/'+category,record1);
                    }
                });
        }
    }
}

