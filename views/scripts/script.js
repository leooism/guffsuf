import { connectToNewUser, socket, client } from "./connection.js ";
import { renderVideo } from "./ui.js";
let localStream;

//media constraints
const constraints = (window.constraints = {
	video: true,
	audio: false,
	width: { min: 640, ideal: 1280 },
	height: { min: 480, ideal: 720 },
	advanced: [{ width: 1920, height: 1280 }, { aspectRatio: 1.333 }],
});

//Function to get video track
const getVideoTrack = async function (options) {
	return await navigator.mediaDevices.getUserMedia(options);
};
//On getting videotrack render video
getVideoTrack(constraints)
	.then(async (stream) => {
		localStream = await stream;
		client.stream = localStream;
		const video = document.createElement("video");
		video.setAttribute("id", client.id);
		video.className = `mini md:rounded-full  w-full h-full md:w-64 md:h-64 object-cover`;

		renderVideo(video, localStream);
	})
	.catch((err) => {
		alert(err);
		return;
	});

socket.on("user-connected", async (id) => {
	connectToNewUser(localStream, id);
});
