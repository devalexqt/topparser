var topparser=require("./index.js")//topparser

    //start topparser, with options (optional): pid_limit, pid_sort, pid_filter
    topparser.start(
        {
            pid_limit:10,// limit of included pids in result list
            pid_sort:(a,b)=>{//sort pid list by memorry usage
                return a.mem-b.mem
            },
            pid_filter:(proc)=>{//include only pids with user == root
                return proc.user=="root"?proc:null
            },//filter
        })

    //then data is available
    topparser.on("data",data=>{
        console.log(JSON.stringify(data,0,2))
    })

    //if some error happens
    topparser.on("error",error=>{
        console.log(error)
    })

    //if topparser exit
    topparser.on("close",code=>{
        console.log(code)
    })

    //kill topparser after 10 seconds for example
    setTimeout(()=>{
        topparser.stop()
    },10000)