const User = require("../models/userModel");
const UserProfile = require("../models/userProfileModel");

const getUserByUsername = ({ username }) => {
	return new Promise(async (resolve) => {
		User.findOne({ username }).then((user) => {
			return resolve(user);
			/*
			if (user) {
				UserProfile.findOne({ 
					userId: user._id.toString()
				}).then((profile) => {
					// manually build user/profile obj
					//	so that password may be deleted
					//	before reaching client
					return resolve({
						id: user._id.toString(),
						username: user.username,
						password: user.password,
						email: user.email,
						profile: {
							id: profile._id.toString(),
							userId: profile.userId,
							firstName: profile.firstName,
							lastName: profile.lastName,
							phone: profile.phone	
						}
					});
				});
			} else {
				return resolve(user);
			}*/
		});
	});
}

const create = async (user) => {
	const newUser = new User({
		...user,
		profile: {
			firstName: "",
			lastName: "",
			middleInitial: ""
		},
		contactInfo: {
			phone: [],
			email: [],
			address: {
				lines: [],
				city: "",
				state: "",
				zip: "",
				country: ""
			}
		}
	})
	await newUser.save((err, _user) => {
		if (err) return console.error(err);
		console.log(_user);
	});
	return Promise.resolve(newUser);
	/*
	return new Promise(async (resolve) => {
		User.create(user).then(async (user) => {
			UserProfile.create({ 
				userId: user._id.toString(),
				firstName: "",
				lastName: "",
				phone: ""
			}).then((profile) => {
				return resolve({
					id: user._id.toString(),
					username: user.username,
					email: user.email,
					profile: {
						id: profile._id.toString(),
						userId: profile.userId,
						firstName: profile.firstName,
						lastName: profile.lastName,
						phone: profile.phone	
					}
				});
			});
		});
	});
	*/
}

const updateUserById = ({ id }) => {

}

module.exports = {
	create: create,
	getUserByUsername: getUserByUsername
}