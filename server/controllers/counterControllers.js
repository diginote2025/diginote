import Counter from "../models/counterSchema.js";

export const create = async (req, res) => {
  try {
    // Create only if it doesn't exist
    let counter = await Counter.findOne();
    if (!counter) {
      counter = new Counter({ value: 0 });
      await counter.save();
    }
    res.json({ value: counter.value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const increment = async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      {},
      { $inc: { value: 1 } },
      { new: true, upsert: true } // upsert creates if not exists
    );
    res.json({ value: counter.value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const decrement = async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      {},
      { $inc: { value: -1 } },
      { new: true, upsert: true }
    );
    res.json({ value: counter.value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
