const { prisma, createUser } = require("../Data/getData");
const { promisify } = require("util");

const jwt = require("jsonwebtoken");
const { hashData, compareHash } = require("../util/hashData");

const createSendToken = async (user, res) => {
	const token = await jwt.sign(
		{
			data: user,
		},
		process.env.JWT_SECRET
	);
	const cookieOptions = {
		expires: new Date(Date.now() + +process.env.EXPIRES_IN * 24 * 60 * 60),
		httpOnly: true,
	};

	// if (process.env.ENV === "Production") cookieOptions.secure = true;
	await res.cookie("jwt", token, cookieOptions);
	res.send({
		status: "Sucessful",
		data: {
			...user,
		},
		message: "You are logged in.💖",
	});
};

const isLoggedIn = async (req, res, next) => {
	if (!req.cookies?.jwt) {
		console.log("Not logged In");
		next();
		return;
	}
	const decoded = await promisify(jwt.verify)(
		req.cookies.jwt,
		process.env.JWT_SECRET
	);
	//User is not logged in or session is expired
	if (!decoded) {
		return;
	}

	const freshUser = await prisma.users.findFirst({
		where: {
			user_id: decoded.id,
		},
	});

	res.locals.user = freshUser;
	next();
};

const login = async (req, res) => {
	const { email, password } = req.body;
	const existingUser = await prisma.user_Password.findFirst({
		where: {
			email: email,
		},
	});

	const isPasswordTrue = compareHash(password, existingUser.password);
	if (!existingUser || !isPasswordTrue) {
		res.send({
			status: "Unsucessful",
			message: "Invalid Password or Email",
		});
		return;
	}

	const user = await prisma.user_Email
		.findUnique({
			where: {
				email: email,
			},
		})
		.Users();

	return createSendToken(user, res);
	// 	.Users();
};

const signup = async (req, res) => {
	const { fname: firstName, lname: lastName, email, password } = req.body;
	const existingUser = await prisma.user_Email
		.findFirst({
			where: {
				email: email,
			},
		})
		.Users();

	//Check if the user exist

	if (existingUser) {
		res.send({
			status: "Unsucessful",
			message: "User Already Exist",
		});
		return;
	}

	const cryptedPwd = hashData(password);
	//Create user based on the given data
	await createUser(firstName, lastName, email, cryptedPwd);

	const newUser = { firstName, lastName, email };
	//Generate Token
	createSendToken(newUser, res);
};

const securePath = async (req, res, next) => {
	//Check if bearer exist
	const token = req.cookies.jwt;
	//If not user is not authenticated
	const isAuthenticated = jwt.verify(token, process.env.JWT_SECRET);
	if (!isAuthenticated) {
		return res.send({
			status: "Unsucessful",
			message: "Incorrect Password.",
		});
	}
	//If user exist then next
	next();
};

module.exports = { login, signup, securePath, isLoggedIn };
