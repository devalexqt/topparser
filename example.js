var topparser=require("./index.js")//topparser

    //start topparser    
    topparser.start({pid_limit:10})

    //then data is available
    topparser.on("data",data=>{
        console.log(data)
    })

    //if some error happends
    topparser.on("error",error=>{
        console.log(error)
    })

    //stop topparser after 10 seconds
    setTimeout(()=>{
        topparser.stop()
    },10000)