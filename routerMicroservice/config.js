var fs=require('fs');

var configFile = './config.json';
exports.find = function(category,name) {
    name = name.toUpperCase();
    data = fs.readFileSync(configFile);
    var jsonObj=JSON.parse(data);
    
    for(var i=0,size=jsonObj.length;i<size;i++){
        var record=jsonObj[i];
        if (category == record['category'] && name >= record['start'] && name <= record['end']) {
            return record['server'];
        }
    }
};

exports.getServerList = function(category) {
    data = fs.readFileSync(configFile);
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
    data = fs.readFileSync(configFile);
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
    data = fs.readFileSync(configFile);
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
    data = fs.readFileSync(configFile);
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
    data = fs.readFileSync(configFile);
    var jsonObj=JSON.parse(data);
    var list = new Array();
    var j=0;
    for(var i=0,size=jsonObj.length;i<size;i++){
        var record=jsonObj[i];
        if (category == record['category'] ) {
            record['start'] = splitChars[j*2];
            record['start'] = splitChars[j*2+1];
            list.push(record);
            j++;
        }
        else {
            list.push(record);
        }
    }
    fs.writeFile(configFile, JSON.stringify(list),
    function(err) {
        if(err) throw err;
    });
    return;
}

