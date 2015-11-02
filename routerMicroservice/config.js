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
