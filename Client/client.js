import net from "net";

const host = "jiaa.me";
const port = 80;

const method = "GET";
const body = "";
const route = "/";
const contentType = "application/json";

const client = net.createConnection({ port, host }, () => {
	const req =
		`${method} ${route} HTTP/1.1\r\n` +
		`Host: ${host}\r\n` +
		`Content-Type: ${contentType}\r\n` +
		`Accept: ${contentType}\r\n` +
		`Content-Length: ${Buffer.byteLength(body)}\r\n` +
		`Connection: close\r\n` +
		`\r\n` +
		body;

	client.write(req);
});

client.on("data", (data) => {
	console.log(data.toString());
});

client.on("end", () => {
	console.log("Connection closed.");
});

client.on("error", (err) => {
	console.error("Connection error:", err.message);
});
