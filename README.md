
#Description
Parse linux TOP command output to JSON format.

#Install
```
npm install git://github.com/devalexqt/topparser.git
```

#Usage
``` javascript
var topparser=require("topparser")
...
console.dir(topparser.parse(data,pid_limit))// pid_limit - limit process count to same number
```

#Example
raw top output
``` text
top - 21:34:01 up  2:00,  3 users,  load average: 0.42, 0.18, 0.31
Tasks: 197 total,   2 running, 195 sleeping,   0 stopped,   0 zombie
%Cpu(s):  0.8 us,  3.1 sy,  0.1 ni, 95.0 id,  0.4 wa,  0.6 hi,  0.0 si,  0.0 st
KiB Mem:    727308 total,   663876 used,    63432 free,     4992 buffers
KiB Swap:   753660 total,   309592 used,   444068 free.   163452 cached Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND
10175 root      20   0  124140  78220  44200 R  68.0 10.8   0:07.20 python
 1359 root      20   0  528700 105328  19052 S  11.3 14.5  12:52.64 Xorg
10206 alex      20   0   24952   1512   1060 R  11.3  0.2   0:00.18 top
 1990 alex      20   0 1560256  89708  21168 S   5.7 12.3  13:28.23 cinnamon
    1 root      20   0   37352   5688    488 S   0.0  0.8   0:04.93 init
    2 root      20   0       0      0      0 S   0.0  0.0   0:00.07 kthreadd
    3 root      20   0       0      0      0 S   0.0  0.0   0:54.12 ksoftirqd/0
    4 root      20   0       0      0      0 S   0.0  0.0   0:00.00 kworker/0:0
    5 root       0 -20       0      0      0 S   0.0  0.0   0:00.00 kworker/0:+
    6 root      20   0       0      0      0 S   0.0  0.0   0:15.60 kworker/u1+
    7 root      20   0       0      0      0 S   0.0  0.0   1:26.53 rcu_sched
    8 root      20   0       0      0      0 S   0.0  0.0   0:25.33 rcuos/0
    9 root      20   0       0      0      0 S   0.0  0.0   0:18.47 rcuos/1
   10 root      20   0       0      0      0 S   0.0  0.0   0:17.37 rcuos/2
   11 root      20   0       0      0      0 S   0.0  0.0   0:15.33 rcuos/3
   12 root      20   0       0      0      0 S   0.0  0.0   0:15.10 rcuos/4
   13 root      20   0       0      0      0 S   0.0  0.0   0:13.57 rcuos/5
   14 root      20   0       0      0      0 S   0.0  0.0   0:15.09 rcuos/6
   15 root      20   0       0      0      0 S   0.0  0.0   0:13.89 rcuos/7
   16 root      20   0       0      0      0 S   0.0  0.0   0:00.00 rcu_bh
   17 root      20   0       0      0      0 S   0.0  0.0   0:00.00 rcuob/0
```

JSON output:
``` 
{ process: 
   [ { pid: '1990',
       user: 'alex',
       pr: '20',
       ni: '0',
       virt: '1560516',
       res: '90656',
       shr: '21864',
       s: 'S',
       cpu: '6.1',
       mem: '12.5',
       time: '13:46.58',
       command: 'cinnamon' },
     { pid: '5381',
       user: 'alex',
       pr: '20',
       ni: '0',
       virt: '929508',
       res: '119792',
       shr: '8132',
       s: 'S',
       cpu: '6.1',
       mem: '16.5',
       time: '11:14.11',
       command: 'firefox' },
     { pid: '0245',
       user: 'alex',
       pr: '20',
       ni: '0',
       virt: '24948',
       res: '1508',
       shr: '1056',
       s: 'R',
       cpu: '6.1',
       mem: '0.2',
       time: '0:00.02',
       command: 'top' },
     { pid: '1',
       user: 'root',
       pr: '20',
       ni: '0',
       virt: '37352',
       res: '5688',
       shr: '488',
       s: 'S',
       cpu: '0.0',
       mem: '0.8',
       time: '0:04.93',
       command: 'init' },
     { pid: '2',
       user: 'root',
       pr: '20',
       ni: '0',
       virt: '0',
       res: '0',
       shr: '0',
       s: 'S',
       cpu: '0.0',
       mem: '0.0',
       time: '0:00.07',
       command: 'kthreadd' },
     { pid: '3',
       user: 'root',
       pr: '20',
       ni: '0',
       virt: '0',
       res: '0',
       shr: '0',
       s: 'S',
       cpu: '0.0',
       mem: '0.0',
       time: '0:54.23',
       command: 'ksoftirqd/0' },
     { pid: '4',
       user: 'root',
       pr: '20',
       ni: '0',
       virt: '0',
       res: '0',
       shr: '0',
       s: 'S',
       cpu: '0.0',
       mem: '0.0',
       time: '0:00.00',
       command: 'kworker/0:0' }
],
  task: { total: 194, running: 1, sleeping: 193, stopped: 0, zombie: 0 },
  cpu: 
   { us: 0.9,
     sy: 3.1,
     ni: 0.1,
     '.0id': 95,
     wa: 0.3,
     hi: 0.6,
     si: 0,
     st: 0 },
  ram: { total: 727308, used: 664028, free: 63280, buffers: 7600 },
  swap: { total: 753660, used: 309516, free: 444144, cachedMem: 187424 } }
```
