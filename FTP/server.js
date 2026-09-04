import net from "net";
import fs from "fs/promises";
import fs2 from "fs";
import path from "path";
const ls = async () => {
	let files = await fs.readdir(path.resolve("./Files"));
	let obj = {};
	for (let i = 0; i < files.length; i++) {
		let stats = await fs.stat(path.resolve(`./Files/${files[i]}`));
		obj[files[i]] = stats;
	}
	return obj;
};
const del = async (file) => {
	try {
		await fs.unlink(path.resolve(`./Files/${file}`));
		return true;
	} catch (err) {
		return false;
	}
};
const download = (file, socket) => {
	try {
		let stream = fs2.createReadStream(path.resolve(`./Files/${file}`), {
			highWaterMark: 2 * 1024,
		});
		stream.pipe(socket);
	} catch (err) {
		socket.write("Unable to download the video");
		console.log(err);
	}
};
const upload = (file,socket)=>{
	const writeStream = fs2.createWriteStream(path.resolve(`./Files/${file}`));
	socket.pipe(writeStream);
}
const server = net.createServer((socket) => {
	socket.on("data", async (cmd) => {
		cmd = cmd.toString();

		if (cmd == "ls\n") {
			socket.write(JSON.stringify(await ls()));
		} else if (cmd.split(" ")[0] == "delete") {
			let file = cmd.split(" ")[1];
			file = file.replace("\n", "");
			if ((await del(file)) == true) {
				socket.write(`${file} deleted successfully!\n`);
			} else {
				socket.write("File does not exist!\n");
			}
		} else if (cmd.split(" ")[0] == "download") {
			let file = cmd.split(" ")[1];
			file = file.replace("\n", "");
			let isFilePresent = await fs.readdir(path.resolve(`./Files`));
			let len = isFilePresent.length;
			let flag = "false";
			for (let i = 0; i < len; i++) {
				if (isFilePresent[i] == file) {
					flag = "true";
					break;
				}
			}
			if (flag == "true") {
				download(file, socket);
			} else {
				socket.write("File doesn't exists!\n");
			}
		}
		else if(cmd.split(" ")[0] == "upload"){
			let file = cmd.split(" ")[1];
			file = file.replace("\n","");
			upload(file,socket);
		} 
		else {
			socket.write("Invalid Command\n");
		}
	});
});
server.listen(8000, "127.0.0.1", () => {
	console.log("Server Started...");
});
