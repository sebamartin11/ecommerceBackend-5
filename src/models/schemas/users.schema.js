const mongoose = require("mongoose");

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
  },
  password: {
    type: String,
  },
  profile_image: {
    type: String,
    default: "default.jpg",
  },
  github_username: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin", "premium"],
    default: "user",
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  documents: {
    type: [
      {
        name: String,
        reference: String,
        docType: {
          type: String,
          enum: ["id_document", "proof_of_address", "account_status"],
        },
      },
    ],
    default: [],
  },
  last_connection: {
    type: Date,
    default: Date.now(),
  },
  update_status: {
    type: Boolean,
    default: false,
  },
});

module.exports = {
  UsersModel: mongoose.model(userCollection, userSchema),
};
