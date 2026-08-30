import net from "net";
let users = new Set();
const server = net.createServer((socket) => {
	users.add(socket);
	console.log(`User connected, IP: ${socket.remoteAddress}`);
	for (let user of users) {
		if (socket != user) {
			user.write(`${socket.remoteAddress} joined the chat\n`);
		} else {
			user.write("You joined the chat.\n");
		}
	}
	socket.on("data", (data) => {
		const msg = data.toString();
		for (let user of users) {
			if (user != socket) {
				user.write(`${socket.remoteAddress}: ${msg}`);
			}
		}
	});
	socket.on("end", () => {
		users.delete(socket);
		for (let user of users) {
			user.write(`${socket.remoteAddress} left the chat.\n`);
		}
	});
});
server.listen(8000, () => {
	console.log("Server Started...");
});
