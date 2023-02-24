import { client } from "./connection.js";

let elem = document.querySelector(".video-grid");
let videoControls = document.querySelector(".video-controls");

const castBtn = document.querySelector(".cast");
export const handleCastStream = function (stream) {
	navigator.mediaDevices.getDisplayMedia().then((stream) => {
		const videoTrack = stream.getVideoTracks()[0];
		client.sender &&
			client.sender
				.getSenders()
				.find((sender) => {
					return sender.track.kind === "video";
				})
				.replaceTrack(videoTrack);
	});
	// return stream;
};
castBtn.addEventListener("click", function (e) {
	handleCastStream(null);
	// navigator.mediaDevices
	// 	.getDisplayMedia()
	// 	.then(handleCastStream)
	// 	.catch((err) => {
	// 		console.log(err);
	// 	});
});

const fullScreenBtn = document.querySelector(".full-screen");
//Toggle Full Screen feature;
function toggleFullscreen() {
	document.addEventListener("mousemove", (e) => {
		videoControls.style.display = "flex";
		if (addNoCursor) {
			clearTimeout(addNoCursor);
		}
		const addNoCursor = setTimeout(function () {
			elem.classList.add("no-cursor");
			videoControls.style.display = "none";
		}, 5000);

		if (elem.classList.contains("no-cursor")) {
			elem.classList.remove("no-cursor");
		}
	});
	document.querySelector(".participants").classList.add("hide-participants");

	if (!document.fullscreenElement) {
		elem.requestFullscreen().catch((err) => {
			alert(
				`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
			);
		});
	} else {
		document.exitFullscreen();
		document
			.querySelector(".participants")
			.classList.remove("hide-participants");
		elem.classList.remove("no-cursor");
	}
}
// fullScreenBtn.addEventListener("click", function (e) {
// 	toggleFullscreen(e);
// });
