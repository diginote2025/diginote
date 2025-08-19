import Chapter from "../models/Chapter.js";

export const getData = async (req, res) => {
  try {
    const chapters = await Chapter.find({});
    res.status(200).json(chapters);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching chapters", error: error.message });
  }
};
