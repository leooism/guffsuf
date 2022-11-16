import { connectToNewUser, socket, client } from "./connection.js ";
import { renderVideo } from "./ui.js";
let localStream;
console.log("Yooo from script");
const constraints = {
	video: true,
	width: { min: 640, ideal: 1280 },
	height: { min: 480, ideal: 720 },
	advanced: [{ width: 1920, height: 1280 }, { aspectRatio: 1.333 }],
};

const getVideoTrack = async function (options) {
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
		return await navigator.mediaDevices.getUserMedia(options);
};

getVideoTrack(constraints).then(async (stream) => {
	localStream = await stream;
	client.stream = localStream;
	const video = document.createElement("video");
	video.setAttribute("id", client.id);
	video.classList.add("mini");
	renderVideo(video, localStream);
});

socket.on("user-connected", async (id) => {
	console.log("User is connected");
	connectToNewUser(localStream, id);
});
