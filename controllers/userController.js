const UserService = require("../services/userService");

exports.exists = async (req, res) => {
	const { username } = req.params;

	if (!username) res.status(200).json({
		status: "fail",
		errors: "Username is required"
	});

	try {
		//TODO: get by userId (_id) instead
		const user = await UserService.getUserByUsername({
			username
		});
		
		res.status(200).json({
			status: "success",
			exists: (user !== null)
		});
	} catch (e) {
		res.status(500).json({
			status: "fail"
		});
	}
}