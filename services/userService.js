const User = require("../models/userModel");
const UserProfile = require("../models/userProfileModel");

const getUserByUsername = ({ username }) => {
	return new Promise(async (resolve) => {
		User.findOne({ username }).then((user) => {
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
			}
		});
	});
}

const create = (user) => {
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
}

module.exports = {
	create: create,
	getUserByUsername: getUserByUsername
}