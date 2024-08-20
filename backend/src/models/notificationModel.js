import mongoose from "mongoose";

const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^(ftp|http|https):\/\/[^ "]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipient: 1 });

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
