const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");
let clients = [];
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
	// res.redirect(`/meeting/${uuidv4()}`);
	res.render("root");
});

// app.post("/host-meeting", (req, res) => {
// 	const roomId = uuidv4();
// 	const messageOptions = {
// 		from: "leooism10@gmail.com",
// 		to: "xyz@gmail.com",
// 		subject: "Invitation for meeting",
// 		roomId,
// 	};
// 	rooms.push(roomId);
// 	console.log(roomId);
// 	res.redirect(`/${roomId}`);
// });

// app.get("/join-room", (req, res) => {
// 	res.render("join-room");
// });
// app.post("/join-room", (req, res) => {
// 	const { fullName, roomId } = req.body;
// 	const roomMatched = rooms.find((room) => room === roomId);
// 	if (!roomMatched) {
// 		//handle
// 	}
// 	res.redirect(`/${roomMatched}`);
// 	req.user = fullName;
// });
app.get("/meeting/:roomId", (req, res) => {
	res.render("index", { ROOMID: req.params.roomId, name: req.user });
});

app.get("/feedback", (req, res) => {
	res.render("feedback");
});

app.post("/feedback", (req, res) => {
	//send the user feedback to database;

	//redirect to home page

	res.render("join-room");
});

app.use("/", (req, res) => {
	res.render("404");
});

io.on("connection", (socket) => {
	socket.on("join-room", (roomid, userid) => {
		clients.push({
			rommid: roomid,
			user: userid,
		});
		socket.join(roomid);
		socket.to(roomid).emit("user-connected", userid);
		socket.on("chat", (msg) => {
			socket.to(roomid).emit("chat", msg);
		});

		socket.on("disconnect-user", () => {
			socket.broadcast.to(roomid).emit("disconnected", userid);
		});
		socket.on("typing", (id, msgLength) => {
			socket.to(roomid).emit("typing", id, msgLength);
		});
		socket.on("video-status", (status, userId) => {
			socket.to(roomid).emit("video-status", status, userId);
		});
	});
});

httpServer.listen(3000);
