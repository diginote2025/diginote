import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: { type: String },
  age: { type: Number, min: 0 },
  classname: { type: String },
  address: { type: String },
  value: { type: Number, default: 0 },
});

const Task = mongoose.model("test", taskSchema);

export default Task;
