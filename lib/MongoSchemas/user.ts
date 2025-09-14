import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  clerkId: { type: String, required: true },
  imageUrl: { type: String },
});

const User = models.User || model("User", userSchema);
export default User;
