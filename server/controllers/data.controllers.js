import Chapter from "../models/Chapter.js";

export const postData = async (req, res) => {
  try {
    const { name, topics } = req.body;
    const newChapter = new Chapter({ name, topics });
    await newChapter.save();
    res.status(201).json({ message: "Chapter created successfully", data: newChapter });
  } catch (error) {
    
    res.status(500).json({ message: "Error creating chapter", error: error.message });
  }
}

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