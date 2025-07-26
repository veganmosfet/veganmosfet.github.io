// simple wincc mockup server API

const express = require('express');
const basicAuth = require('basic-auth');
const bodyParser = require('body-parser');

const app = express();
const port = 4000;

// Hardcoded credentials
const VALID_USERNAME = "username1";
const VALID_PASSWORD = "password1";
const VALID_BEARER_TOKEN = "mock-token-123";

// In-memory tag store
const tags = {
  "MySystem::Tag1": 42,
  "MySystem::Temperature": 25,
  "MySystem::Tag2": true,
  "MySystem::Pump": false
};

app.use(bodyParser.json());

// Middleware: Require Basic Auth OR Bearer Token
app.use((req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  if (authHeader.startsWith("Basic ")) {
    const creds = basicAuth(req);
    if (!creds || creds.name !== VALID_USERNAME || creds.pass !== VALID_PASSWORD) {
      return res.status(403).json({ error: "Invalid Basic credentials" });
    }
  } else if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    if (token !== VALID_BEARER_TOKEN) {
      return res.status(403).json({ error: "Invalid Bearer token" });
    }
  } else {
    return res.status(401).json({ error: "Invalid Authorization scheme" });
  }

  next();
});

// Optional login endpoint (mocked, not part of real WinCC)
app.post('/WinCCRestService/login', (req, res) => {
  const { username, password } = req.body;
  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    return res.json({ token: VALID_BEARER_TOKEN });
  } else {
    return res.status(403).json({ error: "Invalid username or password" });
  }
});

// GET tag value
app.get('/WinCCRestService/tagManagement/Value/:tagName', (req, res) => {
  const tagName = decodeURIComponent(req.params.tagName);
  if (tagName in tags) {
    res.json({ tagName, value: tags[tagName] });
  } else {
    res.status(404).json({ error: `Tag '${tagName}' not found` });
  }
});

// PUT tag value
app.put('/WinCCRestService/tagManagement/Value/:tagName', (req, res) => {
  const tagName = decodeURIComponent(req.params.tagName);
  const { value } = req.body;
  if (value === undefined) {
    return res.status(400).json({ error: "Missing value in body" });
  }
  if (tagName in tags) {
    tags[tagName] = value;
    res.json({ tagName, newValue: value });
  } else {
    res.status(404).json({ error: `Tag '${tagName}' not found` });
  }

});

// List all mock connections (just return something basic)
app.get('/WinCCRestService/tagManagement/Connections', (req, res) => {
  res.json([
    { name: "PLC_Main", type: "S7", status: "Connected" },
    { name: "OPC_UA_Server", type: "OPC", status: "Disconnected" }
  ]);
});


// Start server
app.listen(port, () => {
  console.log(`✅ WinCC mock server with auth running at http://localhost:${port}/WinCCRestService`);
});
