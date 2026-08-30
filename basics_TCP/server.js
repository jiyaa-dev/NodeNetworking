import net from "net";
const server = net.createServer((socket) => {
	socket.write(`HTTP/1.1 200 OK
        Content-Type: text/html
        Content-Length: 22
        Connection: close

        <h1>Hello, world!</h1>`);
});
server.listen(8000, () => {
	console.log("Server started...");
});
