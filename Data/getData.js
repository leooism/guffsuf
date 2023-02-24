const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: id } = require("uuid");
const fetchData = async () => {
	const data = await prisma.user.findMany({});
	console.log(data);
	// return data;
};

const createUser = async (fname, lname, email, password) => {
	const uid = id();
	try {
		await prisma.user_Password.create({
			data: {
				email: email,
				password: password,
			},
		});

		await prisma.user_Email.create({
			data: {
				user_id: uid,
				email: email,
			},
		});

		await prisma.users.create({
			data: {
				user_id: uid,
				user_fname: fname,
				user_lname: lname,
			},
		});
	} catch (err) {
		// console.log(err);
	}
};

const sendResetToken = async (email) => {
	//Find user by email
	//Check if user exist if not throw error or handle error
	//set the token that is only valid for certain time
};
// writeData();
// console.log(fetchData());

module.exports = { prisma, createUser };
