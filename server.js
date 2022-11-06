const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");
let rooms = [];
const path = require("path");

const app = express();
app.use(express.urlencoded());
let participants = [];
app.set("view engine", "ejs");
app.set("views", "./public");
app.use(express.static(path.join(__dirname, "public")));

const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "https://localhost:5500",
		credentials: true,
	},
});
// connection event listener -> handles all incoming connections form clients

app.get("/", (req, res) => {
	res.redirect(`join-room`);
});
app.get("/host-meeting", (req, res) => {
	const roomId = uuidv4();
	rooms.push(roomId);
	console.log(roomId);
	res.redirect(`/${roomId}`);
});

app.get("/join-room", (req, res) => {
	res.render("join-room");
});
app.post("/join-room", (req, res) => {
	const { fullName, roomId } = req.body;
	const roomMatched = rooms.find((room) => room === roomId);
	if (!roomMatched) {
		//handle
	}
	res.redirect(`/${roomMatched}`);
	req.user = fullName;
});
app.get("/:roomId", (req, res) => {
	res.render("index", { ROOMID: req.params.roomId, name: req.user });
});

/* 
* This signaling server must do.
* Keeping a list of connected clientsNotifying connected clients when a new client connects
* Transmitting connection offers from one client to the other
* Transmitting answers to connection offers
* Exchanging IceCandidate events between clients
* Notifying a user when a client disconnects

! Signaling is the process of determining communication protocols, channels, media codecs and formats
! method of data transfer, and routing information needed to exchange info btn peers.

*/

io.on("connection", (socket) => {
	socket.on("join-room", (roomid, userid) => {
		participants.push({
			type: "user",
			id: userid,
		});
		socket.join(roomid);
		socket.to(roomid).emit("user-connected", userid);
		socket.on("chat", (msg) => {
			socket.to(roomid).emit("chat", msg);
		});
		// socket.on("screen cast", (stream) => {
		// 	console.log(stream);
		// 	socket.to(roomid).emit("screenShare", stream);
		// });
		// socket.on("disconnect-user", (id) => {
		// 	socket.to(roomid).emit("disconnect-user", id);
		// });
		socket.on("typing", (id, msgLength) => {
			socket.broadcast.to(roomid).emit("typing", id, msgLength);
		});
	});
});

httpServer.listen(3000);
