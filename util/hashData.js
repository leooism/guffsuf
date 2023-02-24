const bcrypt = require("bcrypt");
const hashData = async (data) => {
	return await bcrypt.hash(data, 10);
};

const compareHash = async (data, encData) => {
	return await bcrypt.compare(data, encData);
};
module.exports = {
	hashData,
	compareHash,
};
