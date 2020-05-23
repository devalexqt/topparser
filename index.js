var EventEmitter = require('events')
var parser=require("./parser.js")
var spawn = require('child_process').spawn
var proc=null
var startTime=0

var new_parser=require("./new_parser.js")

class TopEmitter extends EventEmitter {}

var topEmitter = new TopEmitter()

topEmitter.start=(options={})=>{
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

			var result={}
			try{
				result=new_parser(data,options,error=>{topEmitter.emit("error",{error})})
			}catch(error){
				topEmitter.emit("error",{error:error})
			}
			
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

