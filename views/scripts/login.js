const createMessage = (res) => {
	const html = `
<div class = "animate-bounce w-64 flex rounded-2xl shadow-2xl px-2 py-2 gap-2 justify-center bg-gray-900 text-white z-10">
${res.status === "Sucessful" ? " <span>✅</span>" : "<span>❌</span>"}

<span>${res.message}</span>
</div>

`;
	let timer;

	const div = document.createElement("div");
	div.innerHTML = html;
	div.style.position = "fixed";
	div.style.top = "10px";
	div.style.left = "0";
	document.querySelector("body").insertAdjacentElement("afterbegin", div);

	timer = setTimeout(() => {
		document.querySelector("body").removeChild(div);
		clearTimeout(timer);
	}, 3000);
};

const Login = async (email, password) => {
	const data = { email, password };
	const res = await fetch("http://localhost:3000/login", {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
			// 'Content-Type': 'application/x-www-form-urlencoded',
		},
	});
	const r = await res.json();
	// console.log(r);
	// console.log(r);
	createMessage(r);

	window.setTimeout(() => {
		location.assign("/");
	}, 1500);
};
export default Login;
