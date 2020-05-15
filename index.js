// windows cygwin: http://superuser.com/questions/630351/top-command-in-cygwin
var EventEmitter = require('events')
var parser=require("./parser.js")
var spawn = require('child_process').spawn
var   proc=null
var startTime=0

class TopEmitter extends EventEmitter {}

var topEmitter = new TopEmitter()

// {
// 	pid_limit:10,//limit number of process to be parsed
// }
topEmitter.start=(options)=>{//pid_limit,callback
	var options=options||{}

	startTime=new Date().getTime()
	proc= spawn('top', ['-l',"0"])// mac: "top -l 0", linux: ['-b',"-d","1"]
	console.log("started process, pid: "+proc.pid)
	var top_data=""

	proc.stdout.on('data',data=>{
	//   console.log('stdout: ' + data);
	  top_data+=data.toString()
	  processData(top_data)
	})

	proc.on('close', code=>{
	  console.log('child process exited with code:',code)
	  topEmitter.emit("close",{code})// then precess was stopped
	})

	proc.stderr.on("data",data=>{
		console.log("error:",data.toString())
	})

	proc.on("error",error=>{
		console.log('child process exited with error:',error);
		topEmitter.emit("error",{error})
	})

	//add on error

	var processData=(_data)=>{
		var start=_data.indexOf("top - ")
		var end=_data.indexOf("top - ",start+1)
		if(end==-1||end==start){return}
		var data=_data.slice(start,end)
			//console.dir(parser.parse(data,3))
			var result=parser.parse(data,options.pid_limit)
				//result.time-=startTime
				//result.time*=1000
			//if(callback){callback(null,result)}
			topEmitter.emit("data",result)
		top_data=_data.replace(data,"")
	}//processData
	return true
}//start

topEmitter.stop=()=>{
	console.log("stoped process...")
	if(proc){proc.kill('SIGINT')}// SIGHUP -linux ,SIGINT -windows
}//stop

module.exports=topEmitter

