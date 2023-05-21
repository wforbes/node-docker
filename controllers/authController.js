const bcrypt = require("bcryptjs");
const UserService = require("../services/userService");
var nodemailer = require('nodemailer');
//const EmailService = require("../services/emailService");

exports.checkSession = async (req, res) => {
	console.log("checkSession hit");
	const { user } = req.session;

	if (!user) {

		return res.status(200).json({
			status: "fail",
			message: "No session found"
		});
		
	}
	
	return res.status(200).json({
		status: "success",
		user
	})
	
};

exports.signup = async (req, res) => {
	console.log("signup hit");
	const { username, password, email } = req.body;
	try {
		const hashedPassword = await bcrypt.hash(password, 12);
		let newUser = await UserService.create({
			username,
			password: hashedPassword,
			email
		});
		delete newUser.password;
		req.session.user = newUser;
		
		//let trans = EmailService.transporter;
		const transporter = nodemailer.createTransport({
			sendmail: true,
			newline: 'unix',
			path: '/usr/sbin/sendmail'
		});
		transporter.sendMail({
			to: email,
			from: '"NoReply" <noreply@node-docker.com>',
			subject: "Confirm your new Node-Docker account",
			text: "Testing",
			html: "<h1>Testing!</h1>"
		}, function (err, info) {
			if (err) 
				console.log(err)
			else
				console.log(info)
		})

		res.status(201).json({
			status: "success",
			newUser
		});
	} catch (e) {
		console.log(e);
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
		const user = await UserService.getUserByUsername({ username });

		if (!user) {
			return res.status(200).json({
				status: 'fail',
				message: 'User not found'
			})
		}
		
		const passwordCorrect = await bcrypt.compare(password, user.password);

		if (passwordCorrect) {

			delete user.password;

			req.session.user = user;

			return res.status(200).json({
				status: "success",
				user
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
