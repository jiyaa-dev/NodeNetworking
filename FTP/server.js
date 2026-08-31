import net from "net";
import fs from "fs/promises";
import path from "path";
const ls = async () => {
	let files = await fs.readdir(path.resolve("./Files"));
        let obj = {};
        for(let i=0; i<files.length; i++){
                let stats = await fs.stat(path.resolve(`./Files/${files[i]}`));
                obj[files[i]] = stats;
        }
        return obj;
};
const server = net.createServer((socket) => {
	socket.on("data", async (cmd) => {
		cmd = cmd.toString();
		if (cmd == "ls\n") {
			socket.write(JSON.stringify(await ls()));
		}
	});
});
server.listen(8000, "127.0.0.1", () => {
	console.log("Server Started...");
});
