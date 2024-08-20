import mongoose from "mongoose";

const { Schema } = mongoose;

const organizationSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
});

organizationSchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
