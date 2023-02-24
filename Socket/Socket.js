let clients = [];

const Socket = (io) => {
	io.on("connection", (socket) => {
		socket.on("join-room", (roomid, userid) => {
			clients.push({
				rommid: roomid,
				user: userid,
			});
			socket.join(roomid);
			socket.to(roomid).emit("user-connected", userid);
			socket.on("chat", (msg) => {
				io.to(roomid).emit("chat", msg);
			});

			socket.on("disconnect", () => {
				socket.to(roomid).emit("user-disconnected", userid);
			});

			socket.on("end-call", (uid) => {
				socket.to(roomid).emit("user-disconnected", uid);
			});

			socket.on("toggle-video", (id) => {
				socket.to(roomid).emit("toggle-video", id);
			});
			socket.on("typing", (id, msgLength) => {
				io.to(roomid).emit("typing", id, msgLength);
			});
			socket.on("video-status", (status, userId) => {
				io.to(roomid).emit("video-status", status, userId);
			});
		});
	});
};

module.exports = Socket;
