const express = require("express");
const {
	login,
	signup,
	securePath,
	isLoggedIn,
} = require("../Controller/authController");
const Router = express.Router();
let USER;

Router.route("/login").post(login);
Router.route("/signup").post(signup);

Router.route("/").get(isLoggedIn, (req, res) => {
	if (USER) {
		res.render("root", {
			USER: {
				user_fname: USER[0].user_fname.trim(),
				user_lname: USER[0].user_lname.trim(),
			},
		});
		return;
	}
	res.render("root", { USER: "" });
});

// Router.get("/host-meeting", isLoggedIn, (req, res) => {
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
Router.get("/host-meeting", (req, res) => res.render("host-meeting"));
Router.get("/signup", (req, res) => {
	res.render("signup");
});

Router.get("/join-room", isLoggedIn, (req, res) => {
	if (USER) {
		res.render("join-room", {
			USER: {
				user_fname: USER[0].user_fname.trim(),
				user_lname: USER[0].user_lname.trim(),
			},
		});
		return;
	}
	res.redirect("/");
});
// Router.post("/join-room", (req, res) => {
// 	const { fullName, roomId } = req.body;
// 	const roomMatched = rooms.find((room) => room === roomId);
// 	if (!roomMatched) {
// 		//handle
// 	res.redirect(`/${roomMatched}`);
// 	req.user = fullName;
// });

Router.get("/feedback", (req, res) => {
	res.render("feedback");
});

Router.post("/feedback", (req, res) => {
	//send the user feedback to developer database;

	//redirect to home page

	res.render("join-room");
});

//If no specified endpoint is found then render Page not found page

module.exports = Router;
