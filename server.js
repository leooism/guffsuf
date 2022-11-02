const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const cors = require("cors");
const path = require("path");
const { createSocket } = require("dgram");

const app = express();

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
	res.redirect(`/${uuidv4()}`);
});

app.get("/:roomId", (req, res) => {
	res.render("index", { ROOMID: req.params.roomId });
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
		socket.join(roomid);
		socket.to(roomid).emit("user-connected", userid);
		socket.on("message", (msg) => {
			socket.to(roomid).emit("createMessage", msg);
		});
	});
});

httpServer.listen(3000);
