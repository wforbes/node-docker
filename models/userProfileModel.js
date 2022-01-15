const mongoose = require("mongoose")

const userProfileSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: [true, "Profile must have a userId"]
	},
	firstName: {
		type: String
	},
	lastName: {
		type: String
	},
	phone: {
		type: String
	}
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema)
module.exports = UserProfile;