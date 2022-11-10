const nodemailer = require("nodemailer");

const sendMail = async (options) => {
	//Create transporter
	const transporter = nodemailer.createTransport({
		host: "",
		auth: {
			user: "",
			pass: "",
		},
	});
	//configure email
	const messageConfiguration = {
		from: options.from,
		to: options.to,
		subject: options.subject,
		html: `
        <h1>You are cordially invited to attend the above meeting.
        </h1>
        <br>
        <p>Meeting Id: ${options.meetingId}</p>
        <br>
        Or
        <p>Follow the link below to join the meeting</p>
        `,
	};
	///send email
	await transporter.sendMail(messageConfiguration);
};
export default sendMail;
