'use strict';

const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;


const worker_set = [];
if (cluster.isMaster) {
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    worker.send('hi there');
    worker.on('message', msg => {
      console.log(`msg: ${msg} from worker#${worker.id}`);
      worker.send('exit');
    });

    worker_set[i] = worker;
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log(`worker ${worker.process.pid} died. (code:' + ${code})`);
  });
} else if (cluster.isWorker) {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
//   http.createServer(function(req, res) {
//     res.writeHead(200);
//     res.end("hello world\n");
//   }).listen(8000);

  process.on('message', msg => {
    switch (msg) {
      case 'exit':
        process.exit(0);
        break;
      default :
        process.send(msg);
        break;
    }
  });

}
