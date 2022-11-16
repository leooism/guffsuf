const inputBox = document.querySelector("#input-box");
const sendBtn = document.querySelector(".send-btn");
const videoGrid = document.querySelector(".video-box");
const participantGrid = document.querySelector("#meeting-room");
const chatMessage = document.querySelector(".msg-box");
const feedback = document.querySelector(".feedback");
const endCallBtn = document.querySelector(".end");
const videoOfOnBtn = document.querySelector(".video-off");
const micOffOnBtn = document.querySelector(".mute");
const chatBtn = document.querySelector(".chatBtn");
import { socket, client } from "./connection.js";
let videoOn = true;
let micOn = true;
console.log("yo from ui");

chatBtn.addEventListener("click", () => {
	document.querySelector(".chat-grid").classList.toggle("hide");
});

inputBox.onkeydown = (e) => {
	socket.emit("typing", id, e.target.value.trim().length);
};

micOffOnBtn.addEventListener("click", () => {
	toggleMuteAudio(client.stream);
});

endCallBtn.addEventListener("click", () => {
	leaveRoom(document.getElementById(String(client.id)));
	// window.location.assign("/feedback");
});

videoOfOnBtn.addEventListener("click", () => {
	toggleStopVideo(client.stream);
});

sendBtn.addEventListener("click", (e) => {
	sendMessage();
	e.preventDefault();
});
const sendMessage = () => {
	const msg = inputBox.value;
	if (msg.trim().length === 0) return;
	const msgBox = document.createElement("p");
	msgBox.classList.add("sender");
	const p = document.createElement("span");
	p.classList.add("sender-msg");
	p.innerText = msg;
	msgBox.appendChild(p);
	chatMessage.appendChild(msgBox);
	socket.emit("chat", msg);
	inputBox.value = "";
};

const renderMessage = (msg) => {
	const msgBox = document.createElement("p");
	msgBox.classList.add("reciever");
	const p = document.createElement("p");
	p.classList.add("reciever-msg");
	p.innerText = msg;
	msgBox.appendChild(p);

	chatMessage.appendChild(msgBox);
};
export const renderVideo = async (videoEle, stream, type = undefined) => {
	if (type === "cast") {
		document.getElementById(String(client.id)).srcObject = stream;
		stream.getVideoTracks().forEach((track) => {
			track.addEventListener("ended", () => {
				document.getElementById(String(client.id)).srcObject = client.stream;
			});
		});
		return;
	}

	videoEle.srcObject = stream;
	videoEle.addEventListener("loadedmetadata", (e) => {
		videoEle.play();
	});
	participantGrid.appendChild(videoEle);
};

const handleUserLeft = (videoElem) => {
	const stream = videoElem.srcObject;
	const tracks = stream.getTracks();
	tracks.forEach((track) => {
		track.stop();
	});
	videoElem.srcObject = null;
	videoElem.remove();
};
const toggleStopVideo = function () {
	if (!client.stream) return;
	console.log(client);
	client.stream.getTracks().forEach((track) => {
		if (track.readyState === "live" && track.kind === "video") {
			track.enabled = !track.enabled;
			socket.emit("video-status", track.enabled, client.id);
			videoOn = !videoOn;
		}
	});
	if (!videoOn) {
		document.querySelector(".cover").classList.add("pin-cover");
		videoOfOnBtn.innerHTML = `<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		fill="currentColor"
		class="bi bi-camera-video-off"
		viewBox="0 0 16 16"
	>
		<path
			fill-rule="evenodd"
			d="M10.961 12.365a1.99 1.99 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272l.714 1H9.5a1 1 0 0 1 1 1v6a1 1 0 0 1-.144.518l.605.847zM1.428 4.18A.999.999 0 0 0 1 5v6a1 1 0 0 0 1 1h5.014l.714 1H2a2 2 0 0 1-2-2V5c0-.675.334-1.272.847-1.634l.58.814zM15 11.73l-3.5-1.555v-4.35L15 4.269v7.462zm-4.407 3.56-10-14 .814-.58 10 14-.814.58z"
		/>
	</svg>`;
	}
	if (videoOn) {
		document.querySelector(".cover").classList.remove("pin-cover");

		videoOfOnBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera-video" viewBox="0 0 16 16">
		<path fill-rule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z"/>
	  </svg>`;
	}
};

const toggleMuteAudio = function () {
	if (!client.stream) return;
	client.stream.getTracks().forEach((track) => {
		if (track.readyState === "live" && track.kind === "audio") {
			track.enabled = !track.enabled;
			micOn = !micOn;
		}
	});
	if (!micOn) {
		micOffOnBtn.innerHTML = `<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		fill="currentColor"
		class="bi bi-mic-mute"
		viewBox="0 0 16 16"
	>
		<path
			d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4.02 4.02 0 0 0 12 8V7a.5.5 0 0 1 1 0v1zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a4.973 4.973 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4zm3-9v4.879l-1-1V3a2 2 0 0 0-3.997-.118l-.845-.845A3.001 3.001 0 0 1 11 3z"
		/>
		<path
			d="m9.486 10.607-.748-.748A2 2 0 0 1 6 8v-.878l-1-1V8a3 3 0 0 0 4.486 2.607zm-7.84-9.253 12 12 .708-.708-12-12-.708.708z"
		/> 	
	</svg>`;
	}
	if (micOn) {
		micOffOnBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-mic" viewBox="0 0 16 16">
		<path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
		<path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"/>
	  </svg>`;
	}
};

socket.on("chat", (msg) => {
	feedback.innerHTML = " ";
	renderMessage(msg);
});

socket.on("typing", (id, msgLength) => {
	if (!msgLength > 0) return (feedback.innerHTML = "");
	feedback.innerHTML = `<div class="dots-bars-4 messaging"></div>`;
});
function leaveRoom() {
	// socket.emit("disconnect-user", client.id);
	socket.emit("disconnect-user", client.id);
}

participantGrid.addEventListener("click", function (e) {
	if (!e.target.classList.contains("mini")) return;
	if (videoGrid.children.length !== 0) {
		let el = videoGrid.firstElementChild;
		el.classList.remove("pin");
		el.classList.add("mini");
		participantGrid.append(el);
		videoGrid.innerHTML = "";
		participantGrid.classList.toggle("meeting-room");
		participantGrid.classList.toggle("participants");

		videoGrid.classList.toggle("hide");

		return;
	}
	const element = e.target;
	e.target.remove();
	element.classList.remove("mini");
	element.classList.add("pin");
	participantGrid.classList.toggle("participants");
	participantGrid.classList.toggle("meeting-room");
	videoGrid.append(element);
	videoGrid.classList.toggle("hide");
});
