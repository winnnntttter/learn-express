const eventEmitter = require('events');

class Job extends eventEmitter {};

job = new Job();

job.on("done",(timeDone)=>{
  console.log("Job was done at "+timeDone);
});

job.emit("done",new Date());
job.removeAllListeners();
