const User = require("../models/userModel");
const UserProfile = require("../models/userProfileModel");

exports.getUserByUsername = ({ username }) => {
	return new Promise(async (resolve) => {
		User.findOne({ username }).then((user) => {
			if (user) {
				//todo: create better solution than this hacky work around IIFE
				user.profile = (async() => await UserProfile.findOne({ userId: user.userId }))();
			}
			return resolve(user);
		});
	});
}

exports.create = (user) => {
	return new Promise(async (resolve) => {
		User.create(user).then(async (user) => {
			//research: can't delete properties for some reason
			delete user._id;
			user = { 
				id: user._id.toString(),
				username: user.username,
				email: user.email
			};
			UserProfile.create({ 
				userId: user.id,
				firstName: "",
				lastName: "",
				phone: ""
			}).then((profile) => {
				// research: can't delete properties for some reason
				user.profile = {
					id: profile._id.toString(),
					userId: profile.userId,
					firstName: profile.firstName,
					lastName: profile.lastName,
					phone: profile.phone
				}
				return resolve(user);
			});
		});
	});
}