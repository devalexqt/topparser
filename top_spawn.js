// windows cygwin: http://superuser.com/questions/630351/top-command-in-cygwin
var topparser=require("topparser")
var spawn = require('child_process').spawn
var   proc=null
var startTime=0

exports.start=function(pid_limit,callback){
	startTime=new Date().getTime()
	proc    = spawn('top', ['-b',"-d","1"])
	console.log("started process, pid: "+proc.pid)
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
			//console.dir(topparser.parse(data,3))
			var result=topparser.parse(data,pid_limit)
				//result.time-=startTime
				//result.time*=1000
			if(callback){callback(null,result)}
		top_data=_data.replace(data,"")
	}//processData
	return true
}//start

exports.stop=function(){
	console.log("stoped process...")
	if(proc){proc.kill('SIGINT')}// SIGHUP -linux ,SIGINT -windows
}//stop

