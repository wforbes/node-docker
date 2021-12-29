const bcrypt = require("bcryptjs")
const User = require("../models/userModel");

exports.signup = async (req, res) => {
	const { username, password } = req.body;
	try {
		const hashedPassword = await bcrypt.hash(password, 12);
		const newUser = await User.create({
			username,
			password: hashedPassword
		});
		
		res.status(201).json({
			status: "success",
			data: {
				newUser
			}
		});
	} catch (e) {
		res.status(400).json({
			status: "fail"
		});
	}
}

exports.login = async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await User.findOne({ username });
		
		if (!user) {
			return res.status(404).json({
				status: 'fail',
				message: 'user not found'
			})
		}
		const passwordCorrect = await bcrypt.compare(password, user.password);
		if (passwordCorrect) {
			res.status(200).json({
				status: "success"
			})
		} else {
			res.status(404).json({
				status: 'fail',
				message: 'incorrect username or password'
			})
		}
	} catch (e) {
		res.status(400).json({
			status: "fail"
		});
	}
}