const User = require("../models/userModel");

exports.exists = async (req, res) => {
	const { username } = req.params;

	if (!username) res.status(200).json({
		status: "fail",
		errors: "Username is required"
	});

	try {
		const user = await User.findOne({
			username
		});
		if (user) {
			res.status(200).json({
				status: "success",
				exists: true
			});
		} else {
			res.status(200).json({
				status: "success",
				exists: false
			});
		}
	} catch (e) {
		res.status(500).json({
			status: "fail"
		});
	}
}