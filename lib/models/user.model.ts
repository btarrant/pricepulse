import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
