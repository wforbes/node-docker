const ObjectId = require('mongodb').ObjectId;
const User = require("../models/userModel");
const UserProfile = require("../models/userProfileModel");

const getUserByUsername = ({ username }) => {
	return new Promise(async (resolve) => {
		User.findOne({ username }).then((user) => {
			if (!user)
				return resolve(user);

			return resolve({
				id: user._id.toString(),
				username: user.username,
				password: user.password,
				email: user.email,
				profile: user.profile,
				contactInfo: user.contactInfo
			});
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
	return Promise.resolve({
		id: newUser._id.toString(),
		username: newUser.username,
		password: newUser.password,
		email: newUser.email,
		profile: newUser.profile,
		contactInfo: newUser.contactInfo
	});
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

const updateUserFieldById = async ({ id, field, newValue }) => {
	let updateObj = {};
	let updated;
	if (Array.isArray(field)) {
		// field as array refers to a nested object's field (profile or contact)
		updated = await User.findOne({ '_id': new ObjectId(id) });

		if (field.length === 3) {
			updated[field[0]][field[1]][field[2]] = newValue;
		} else {
			updated[field[0]][field[1]] = newValue;
		}
		
		await updated.save((err, _user) => {
			if (err) return console.error(err);
			console.log(_user);
		});
	} else {
		updateObj[field] = newValue;
		updated = await User.findByIdAndUpdate({ '_id': new ObjectId(id) }, updateObj, {
			new: true
		});
	}
	
	
	// convert _id to id, remove password
	updated = {
		id: updated._id.toString(),
		username: updated.username,
		email: updated.email,
		profile: updated.profile,
		contactInfo: updated.contactInfo
	}
	return Promise.resolve(updated);
}	

module.exports = {
	create: create,
	getUserByUsername: getUserByUsername,
	updateUserFieldById: updateUserFieldById
}