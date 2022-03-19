"use strict";
const http = require("http");
const PORT = process.env.PORT || 3000;
const url = require("url");
const { STATUS_CODES } = http;
const hello = `<html>
  <head>
    <style>
     body { background: #333; margin: 1.25rem }
     h1 { color: #EEE; font-family: sans-serif }
    </style>
  </head>
  <body>
    <h1>You think you have an execuse.</h1>
  </body>
</html>`;

const root = `<html>
  <head>
    <style>
     body { background: #333; margin: 1.25rem }
     h1 { color: #EEE; font-family: sans-serif }
    </style>
  </head>
  <body>
    <h1>You will have to pass it</h1>
  </body>
</html>`;
const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html");
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end("Only get allowed" + "\n");
    return;
  }
  const { pathname } = url.parse(req.url);
  if (pathname === "/") {
    res.end(root);
    return;
  }
  if (pathname === "/root") {
    res.end(hello);
    return;
  }
  res.statusCode = 404;
  res.end(STATUS_CODES[res.statusCode]);
});
server.listen(PORT);
