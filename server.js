const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
// const { v4: uuidv4 } = require("uuid");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const Router = require("./Routes/userRoutes");
const Socket = require("./Socket/Socket");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fs = require("fs");
const app = express();
app.use(express.urlencoded());
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(path.join(__dirname, "/views")));
app.get("/meeting/:roomId", (req, res) => {
	res.render("index", { ROOMID: req.params.roomId, name: req.user });
});
app.use(expressLayouts);
app.use(express.json());
app.use("/", Router);

const options = {
	key: fs.readFileSync("server.key"),
	cert: fs.readFileSync("server.cert"),
};

app.use(
	cors({
		origin: true,
		credentials: true,
	})
);
app.use(cookieParser());

// app.use(
// 	session({
// 		secret: "GuffSuf",
// 		saveUninitialized: true,
// 		resave: true,
// 	})
// );

// app.use(flash());

app.use("/", (req, res) => {
	return res.render("404");
});
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "https://localhost:5500",
		credentials: true,
	},
});
Socket(io);

// connection event listener -> handles all incoming connections form clients

httpServer.listen(3000);
