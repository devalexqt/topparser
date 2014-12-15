var topparser=require("./topparser/index.js")
var spawn = require('child_process').spawn

//var top=new _TopParser()

 var   proc    = spawn('top', ['-b'])
var top_data=""
proc.stdout.on('data', function (data) {
  //console.log('stdout: ' + data);
  top_data+=data.toString()
  processData(top_data)
});

proc.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

proc.on('close', function (code) {
  console.log('child process exited with code ' + code);
});

	var processData=function (_data){
		var start=_data.indexOf("top - ")
		var end=_data.indexOf("top - ",start+1)
		if(end==-1||end==start){return}
		var data=_data.slice(start,end)
		//console.log("===========>DATA:"+data)
		//console.dir(top.parse(data))
		console.dir(topparser.parse(data))
		_data=_data.replace(data,"")
	}//processData

//console.dir(topparser)
