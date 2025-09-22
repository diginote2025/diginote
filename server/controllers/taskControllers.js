import Task from "../models/taskSchema.js";

export const sendTask = async (req, res) => {
  try {
    const { name, age, classname, address } = req.body;
    const moduleTask = new Task({ name, age, classname, address });
    await moduleTask.save();
    res
      .status(201)
      .json({ message: "task send successfully", data: moduleTask });
  } catch (error) {
    console.error(error);
  }
};

export const recieveTask = async (req, res) => {
  try {
    const moduleTask = await Task.find({});
    res.status(200).json(moduleTask);
  } catch (error) {
    console.error(error);
  }
};

export const deleteTask = async (req, res) => {
  try {
    const {id} = req.params
    const moduleTask = await Task.findByIdAndDelete(id);
     res
      .status(200)
      .json({ message: "task delete successfully", data: moduleTask });
  } catch (error) {
    console.error(error);
  }
};

export const updateTask = async (req, res) => {
  try {
    const {id} = req.params
    const {name, age, classname, address} = req.body
    const moduleTask = await Task.findByIdAndUpdate(id, {name, age, classname, address}, {new: true});
     res
      .status(200)
      .json({ message: "task update successfully", data: moduleTask });
  } catch (error) {
    console.error(error);
  }
};