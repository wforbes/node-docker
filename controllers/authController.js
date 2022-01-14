const bcrypt = require("bcryptjs")
const User = require("../models/userModel");

exports.checkSession = async (req, res) => {
	const { user } = req.session;
	
	if (!user) {
		return res.status(200).json({
			status: "fail",
			message: "No session found"
		});
	}
	
	return res.status(200).json({
		status: "success",
		user: {
			username: user.username,
			id: user._id,
			email: user.email
		}
	})
	
};

exports.signup = async (req, res) => {
	const { username, password, email } = req.body;
	try {
		const hashedPassword = await bcrypt.hash(password, 12);
		let newUser = await User.create({
			username,
			password: hashedPassword,
			email
		});
		req.session.user = newUser;
		newUser = { username: newUser.username, id: newUser._id, email };
		res.status(201).json({
			status: "success",
			newUser
		});
	} catch (e) {
		res.status(400).json({
			status: "fail"
		});
	}
}

exports.login = async (req, res) => {
	const { username, password } = req.body;
	if (req.session.user) {
		const sessionUser = req.session.user;
		if (sessionUser.username === username) {
			return res.status(200).json({
				status: 'fail',
				message: 'Duplicate login attempt'
			});
		}
	}

	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(200).json({
				status: 'fail',
				message: 'User not found'
			})
		}
		
		const passwordCorrect = await bcrypt.compare(password, user.password);
		if (passwordCorrect) {
			req.session.user = user;
			return res.status(200).json({
				status: "success",
				user: { 
					username: user.username,
					id: user._id,
					email: user.email
				}
			});
		} else {
			return res.status(200).json({
				status: 'fail',
				message: 'Incorrect username or password'
			});
		}
	} catch (e) {
		res.status(400).json({
			status: "fail"
		});
	}
}

exports.logout = async (req, res) => {
	if (!req.session.user)
		return res.status(200).json({
			status: "fail",
			message: "Not currently logged in"
		})
	const sessionId = req.session.id;
	req.session.destroy(sessionId, (err) => {
		if (err) {
			return console.error(err);
		}
	});
	return res.status(200).json({
		status: "success"
	});
}
