//https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp

function parseSwap(str){
    var regex_root=/Swap/g
        if(!regex_root.exec(str)){
            return {}
        }//swap

    var result={}

    var regex_total=/(\d+) total/g;
    var regex_used=/(\d+) used/g;
    var regex_free=/(\d+) free/g;
    var regex_cached_mem=/(\d+) cached Mem/g;
    var regex_avail_memm=/(\d+) avail Mem/g;

    var total=regex_total.exec(str)
        if(total){result.total=total[1]}

    var used=regex_used.exec(str)
        if(used){result.used=used[1]}    

    var free=regex_free.exec(str)
        if(free){result.free=free[1]}
        
    var cached_mem=regex_cached_mem.exec(str)
        if(cached_mem){result.cached_mem=cached_mem[1]}    

    var avail_memm=regex_avail_memm.exec(str)
        if(avail_memm){result.avail_memm=avail_memm[1]}

    return result
}//parseSwap

function parseMem(str){
    var regex_root=/Mem/g
    if(!regex_root.exec(str)){
        return {}
    }//swap

    var result={}

    var regex_total=/(\d+) total/g;
    var regex_used=/(\d+) used/g;
    var regex_free=/(\d+) free/g;
    var regex_cached_mem=/(\d+) buff\/cache/g;

    var total=regex_total.exec(str)
        if(total){result.total=total[1]}

    var used=regex_used.exec(str)
        if(used){result.used=used[1]}    

    var free=regex_free.exec(str)
        if(free){result.free=free[1]}
        
    var cached_mem=regex_cached_mem.exec(str)
        if(cached_mem){result.cached_mem=cached_mem[1]}    

    return result
}//parseMem

function parseStatLine(line,options){
    line=line.replace(/ +(?= )/g,'')// replace multiple spaces

    if(!options.root.regex.exec(line)){
        return {}
    }//root stat line

    var result={}
    var tmp=null

    options.params.forEach(item=>{
        item.keys=item.keys||1
        tmp=item.regex.exec(line)
        if(tmp){
            if(!item.keys||item.keys==1){result[item.name]=tmp[1]}      
            else{
                var subarray=[]
                for(var i=1;i<item.keys+1;i++){
                    subarray.push(tmp[i])
                }//for
                result[item.name]=subarray
            }//else
        }//if
    })
    return result
}//parseCpu


function parseProcessLine(str){
    var result={}
    var regex=/(?<=)\S+/g //capture values beetween spaces

    result=[...str.matchAll(regex)]
    return {
        "pid":result[0][0],
        "user":result[1][0],
        "pr":result[2][0],
        "ni":result[3][0],
        "virt":result[4][0],
        "res":result[5][0],
        "shr":result[6][0],
        "s":result[7][0],
        "cpu":result[8][0],
        "mem":result[9][0],
        "time":result[10][0],
        "command":result[11][0],
    }
}//parseRootTopLine





// {
//     pid_limit:10,//limit number of included pids in list (default: unlimited)
//     pid_filter:(proc)=>{return proc.user=="root"?proc:null},// filtering the pid list (for example: include only pid with user == root) (default: null)
//     pid_sort:(a,b)=>{return a.cpu-b.cpu},// sorting pid list by cpu usage (default)
// }

module.exports=function(data,options={pid_sort(a,b){return a.cpu-b.cpu}}){
    var data=data.split("\n").filter(v=>v!="")

    var result={

        top:parseStatLine(data[0],
            {
                root:{regex:/top \-/g,name:"top"},//root line params
                params:[// parse variable values
                    {regex: /(\d+\:\d+\:\d+) up/g, name:"time"},
                    // {regex: /up  ([0-9,\:]+)\,/g, name:"up"},
                    {regex: / ([0-9,\:]+)\, \d+ user/g, name:"up_hours"},
                    {regex: / (\d+) days/g, name:"up_days"},
    
                    {regex: /(\d+) users/g, name:"users"},
                    {regex: /load average: (\d+\.\d+)\, (\d+\.\d+)\, (\d+\.\d+)/g, name:"load_average",keys:3},//need subarray with values
                    // {regex: /(\d+) zombie/g, name:"zombie"},
                ]
    
            }
        ),//stat 

        tasks:parseStatLine(data[1],
            {
                root:{regex:/Tasks/g,name:"tasks"},//root line params
                params:[// parse variable values
                    {regex: /(\d+) total/g, name:"total"},
                    {regex: /(\d+) running/g, name:"running"},
                    {regex: /(\d+) sleeping/g, name:"sleeping"},
                    {regex: /(\d+) stopped/g, name:"stopped"},
                    {regex: /(\d+) zombie/g, name:"zombie"},
                ]
    
            }
        ),//stat    

        cpu:parseStatLine(data[2],
            {
                root:{regex:/%Cpu/g,name:"cpu"},//root line params
                params:[// parse variable values
                    {regex: /(\d+\.\d) us/g, name:"us"},
                    {regex: /(\d+\.\d) sy/g, name:"sy"},
                    {regex: /(\d+\.\d) ni/g, name:"ni"},
                    {regex: /(\d+\.\d) id/g, name:"id"},
                    {regex: /(\d+\.\d) wa/g, name:"wa"},
                    {regex: /(\d+\.\d) hi/g, name:"hi"},
                    {regex: /(\d+\.\d) si/g, name:"si"},
                    {regex: /(\d+\.\d) st/g, name:"st"},
                ]
            }
        ),//stat

        mem:parseStatLine(data[3],
            {
                root:{regex:/KiB Mem/g,name:"mem"},//root line params
                params:[// parse variable values
                    {regex: /(\d+) total/g, name:"total"},
                    {regex: /(\d+) used/g, name:"used"},
                    {regex: /(\d+) free/g, name:"free"},
                    {regex: /(\d+) buffers/g, name:"buffers"},
                    {regex: /(\d+) buff\/cache/g, name:"buff_cache"},
                ]
                
            }
            ),//stat   

        swap:parseStatLine(data[4],
            {
                root:{regex:/KiB Swap/g,name:"swap"},//root line params
                params:[// parse variable values
                    {regex: /(\d+) total/g, name:"total"},
                    {regex: /(\d+) used/g, name:"used"},
                    {regex: /(\d+) free/g, name:"free"},
                    {regex: /(\d+) cached Mem/g, name:"cached_mem"},
                    {regex: /(\d+) avail Mem/g, name:"avail_mem"},
                ]
            }
        ),//stat
            
        processes:[...( [            
                (()=>{
                    var result=[]
                    for (var i=5;i<data.length-1;i++){
                        var proc=parseProcessLine(data[i])
                        if(typeof options.pid_filter=="function"){//pid filter function
                            proc=options.pid_filter(proc)
                        }//if
                        proc?result.push(proc):null                        
                    }//for
                    return result.slice(0,options.pid_limit||result.length).sort(options.pid_sort)
                 })()//for        
        ]
        )]    
            
    }//result
    
    return result

}//export