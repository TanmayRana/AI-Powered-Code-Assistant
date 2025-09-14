import { Schema, model, models } from "mongoose";

const FollowingSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  followedSheetIds: [
    {
      type: String,
      required: true,
    },
  ],
});

const Following = models.Following || model("Following", FollowingSchema);
export default Following;
