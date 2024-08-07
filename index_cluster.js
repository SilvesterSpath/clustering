const cluster = require('cluster');
const crypto = require('crypto');

console.log('outside: ', cluster.isMaster);

// is the file being executed in master mode?
if (cluster.isMaster) {
  console.log('inside: ', cluster.isMaster);
  // cause index.js to be executed *again* but
  // in child mode
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
} else {
  console.log('else block');
  // Im a child, Im going to act like a server
  // and do nothing else
  const express = require('express');
  const app = express();

  function doWork(duration) {
    const start = Date.now();
    while (Date.now() - start < duration) {
      console.log(Date.now() - start);
    }
  }

  app.get('/', (req, res) => {
    // this will be handled by the event-loop and it will be blocked for 5 sec
    doWork(3000);

    res.send('<h1>Hello All</h1>');
  });

  /* app.get('/:id', (req, res) => {
  console.log('Hello from the console');
  const { id } = req.params;

  res.send(`<h1>Hello ${id}</h1>`);
}); */

  app.get('/fast', (req, res) => {
    res.send('This was fast');
  });

  app.listen(3000, () => {
    console.log('App listening on port 3000!');
  });
}

console.log('after else block');
