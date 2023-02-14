const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');

  const createPath = (page) => path.resolve(__dirname, 'views', `${page}.html`);
  let basePath = '';
  res.statusCode = 200;

  switch (req.url) {
    case '/':
    case '/home':
    case '/index.html':
      basePath = createPath('index');
      break;
    case '/about-us':
      res.statusCode = 301;
      res.setHeader('Location', '/contacts');
      res.end();
      break;
    case '/contacts':
      basePath = createPath('contacts');
      break;
    default:
      basePath = createPath('error');
      res.statusCode = 404;
  }

  fs.readFile(basePath, (err, data) => {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      res.end();
    } else {
      res.write(data);
      res.end();
    }
  });
});

server.listen(PORT, 'localhost', (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Server is running');
  }
});
