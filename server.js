const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const OdyseeChat = require('./odysee-chat');
const MAX_HISTORY = 100;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3003;

const odyseeChat = new OdyseeChat();

odyseeChat.connect(
  process.env.ODYSEE_WS_URL || 'wss://sockety.odysee.tv/ws/commentron?id=xxx' // the claim id of the livestream
);

app.get('/verify-avatar', async (req, res) => {
    try {
        const url = req.query.url;
        const response = await axios.head(url, { timeout: 2000 });
        res.status(response.status).send();
    } catch (e) {
        res.status(404).send();
    }
});

app.get('/emojis.json', (_req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(__dirname, 'public', 'emojis.json'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

wss.on('connection', (ws) => {
    console.log('New livestream chat connected');
    
    const history = odyseeChat.getHistory();
    if (history.length > 0) {
        ws.send(JSON.stringify({
            type: 'batch',
            messages: history.slice(-MAX_HISTORY)
        }));
    }
    
    const messageListener = (msg) => {

        if (!msg.isFromHistory) {
            ws.send(JSON.stringify(msg));
        }
    };
    
    odyseeChat.on('message', messageListener);
    
    ws.on('close', () => {
        odyseeChat.off('message', messageListener);
    });
});

server.listen(PORT, () => {
    console.log(`Server ready in http://localhost:${PORT}`);
    console.log(`Connected to Odysee chat: ${process.env.ODYSEE_WS_URL || 'wss://sockety.odysee.tv/ws/commentron?id=xxx'}`); // the claim id of the livestream
});