var topparser=require("topparser")
var spawn = require('child_process').spawn

var   proc    = spawn('top', ['-b',"-d","1"])
var top_data=""

proc.stdout.on('data', function (data) {
  //console.log('stdout: ' + data);
  top_data+=data.toString()
  processData(top_data)
})

proc.on('close', function (code) {
  console.log('child process exited with code ' + code);
});

	var processData=function (_data){
		var start=_data.indexOf("top - ")
		var end=_data.indexOf("top - ",start+1)
		if(end==-1||end==start){return}
		var data=_data.slice(start,end)
			console.dir(topparser.parse(data,3))
		top_data=_data.replace(data,"")
	}//processData

