'use strict';

const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

const worker_set = [];
if (cluster.isMaster) {
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    worker_set[i] = cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log(`worker ${worker.process.pid} died(code:' + code`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
//   http.createServer(function(req, res) {
//     res.writeHead(200);
//     res.end("hello world\n");
//   }).listen(8000);
  console.log(213);
  process.exit(0);
}
