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

exports.update = async (req, res) => {
	
	const user = req.session.user;
	console.log(req.params.id);
	const reqUserId = req.params.id.trim();
	if (user.id !== reqUserId) {
		// TODO: add auth check for update other users
		//		(use userService to hit authController)
		return res.status(403).json({
			status: "fail",
			message: "Forbidden to update this user data"
		});
	}

	console.log(req.body);
	const field = req.body.field;
	const newValue = req.body.value;
	const updated = await UserService.updateUserFieldById({ id: user.id, field, newValue });
	if (!updated) {
		return res.status(500).json({
			status: "fail"
		})
	}

	return res.status(200).json({
		status: "success",
		user: updated
	});
}