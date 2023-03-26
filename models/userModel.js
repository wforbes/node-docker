const mongoose = require("mongoose")

const userProfileSchema = new mongoose.Schema({
	firstName: {
		type: String
	},
	lastName: {
		type: String
	},
	middleInitial: {
		type: String
	},
	birthday: {
		type: Date
	}
});

const addressSchema = mongoose.Schema({
	lines: [String],
	city: String,
	state: String,
	zip: String,
	country: String
})

const userContactInfoSchema = new mongoose.Schema({
	phone: [Number],
	address: addressSchema
});

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, "User must have a username"],
		unique: true
	},
	password: {
		type: String,
		required: [true, "User must have a password"]
	},
	email: {
		type: String,
		required: [true, "User must have an email address"]
	},
	profile: userProfileSchema,
	contactInfo: userContactInfoSchema
});

const User = mongoose.model("User", userSchema)
module.exports = User;