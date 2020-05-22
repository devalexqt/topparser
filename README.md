## Parse linux / Unix "top" command to json format
Parse unix TOP command raw output to JSON format using <b>node.js</b> without external dependencies. On Windows PC you can use WSL (windows subsystem for linux).

## Test
Just run:
```
//navigate to module folder and run
npm run start
or
node example.js
```

## Install
```
npm install topparser
```
[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=3.14pi@ukr.net&lc=US&no_note=0&currency_code=USD&bn=PP-DonationsBF:btn_donateCC_LG.gif:NonHostedGuest&item_number=topparser)

## Usage
``` javascript
var topparser=require("topparser")


    //start topparser
    topparser.start()

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

    //kill topparser after 10 seconds, for example
    setTimeout(()=>{
        topparser.stop()
    },10000)
```

## Options
``` javascript

var options={
              pid_limit:10,//limit number of included pids in list (default: unlimited)
              pid_filter:(proc)=>{return proc.user=="root"?proc:null},// filtering the pid list (for example: include only pid with user == root) (default: null)
              pid_sort:(a,b)=>{return a.cpu-b.cpu},// sorting pid list by cpu usage (default)
            }


    //start topparser, with options (optional): pid_limit, pid_sort, pid_filter
    topparser.start(options)
    ....
```

JSON output:
``` 
{
  "top": {
    "time": "01:50:41",
    "up_hours": "2:21",
    "users": "0",
    "load_average": [
      "0.52",
      "0.58",
      "0.59"
    ]
  },
  "tasks": {
    "total": "17",
    "running": "1",
    "sleeping": "16",
    "stopped": "0",
    "zombie": "0"
  },
  "cpu": {
    "us": "17.5",
    "sy": "4.7",
    "ni": "0.0",
    "id": "77.5",
    "wa": "0.0",
    "hi": "0.4",
    "si": "0.0",
    "st": "0.0"
  },
  "mem": {
    "total": "33411872",
    "used": "16217872",
    "free": "16964648",
    "buff_cache": "229352"
  },
  "swap": {
    "used": "186300",
    "avail_mem": "17060268"
  },
  "processes": [
    [
      {
        "pid": "1",
        "user": "root",
        "pr": "20",
        "ni": "0",
        "virt": "8892",
        "res": "312",
        "shr": "272",
        "s": "S",
        "cpu": "0.0",
        "mem": "0.0",
        "time": "0:00.07",
        "command": "init"
      },
      {
        "pid": "8",
        "user": "root",
        "pr": "20",
        "ni": "0",
        "virt": "8908",
        "res": "232",
        "shr": "180",
        "s": "S",
        "cpu": "0.0",
        "mem": "0.0",
        "time": "0:00.01",
        "command": "init"
      }
    ]
  ]
}
```
