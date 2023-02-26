import { WebSocketServer } from 'ws';

const server = new WebSocketServer({port: 8080});

const namespaceA = new WebSocketServer({noServer: true});
const namespaceB = new WebSocketServer({noServer: true});

server.on('upgrade', (req, socket, head) => {
    const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
    if (pathname === '/a') {
        namespaceA.handleUpgrade(req, socket, head, (ws) => {
            namespaceA.emit('connection', ws, req);
        });
    } else if (pathname === '/b') {
        namespaceB.handleUpgrade(req, socket, head, (ws) => {
            namespaceB.emit('connection', ws, req);
        });
    } else {
        socket.destroy();
    }
});

namespaceA.on('connection', ws => {
    console.log('connected - a');
    ws.on('message', (message) => {
        console.log(`a: ${message}`);
    });
});

namespaceB.on('connection', ws => {
    console.log('connected - b');
    ws.on('message', (message) => {
        console.log(`b: ${message}`);
    });
});
