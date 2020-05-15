var EventEmitter = require('events')
var parser=require("./parser.js")
var spawn = require('child_process').spawn
var proc=null
var startTime=0

class TopEmitter extends EventEmitter {}

var topEmitter = new TopEmitter()

// {
// 	pid_limit:10,//limit number of process to be parsed
// }
topEmitter.start=(options)=>{//pid_limit,callback
	var options=options||{}

	startTime=new Date().getTime()
	proc= spawn('top', ['-b',"-d","1"])// linux top command parameter: ['-b',"-d","1"]
	var top_data=""

	proc.stdout.on('data',data=>{
	  top_data+=data.toString()
	  processData(top_data)
	})

	proc.on('close', code=>{
	  topEmitter.emit("close",{code})// then precess was stopped
	})

	proc.stderr.on("data",data=>{
		topEmitter.emit("error",{error:data.toString()})
	})

	proc.on("error",error=>{
		topEmitter.emit("error",{error})
	})


	var processData=(_data)=>{
			try{
			var start=_data.indexOf("top - ")
			var end=_data.indexOf("top - ",start+1)
			if(end==-1||end==start){return}
			var data=_data.slice(start,end)
				//console.dir(parser.parse(data,3))
				var result=parser.parse(data,options.pid_limit)
					//result.time-=startTime
					//result.time*=1000
				topEmitter.emit("data",result)
				top_data=_data.replace(data,"")
			return true
		}catch(error){topEmitter.emit("error",{error})}
	}//start

	topEmitter.stop=()=>{
		if(proc){proc.kill('SIGINT')}// SIGHUP -linux ,SIGINT -windows
	}//stop

}//emiter

module.exports=topEmitter

