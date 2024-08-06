const Notes = require("../../models/note");

// Get All Notes
const getAllNotes = async (req, res) => {
  try {
    const data = await Notes.find({ user: req.user._id })
      .populate("user")
      .sort({ createdAt: 1 })
      .exec();

    if (!data) {
      throw new Error("An error occured while fetching notes.");
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occured while fetching notes." });
  }
};

// Get Note by ID
const getNote = async (req, res) => {
  // console.log(req.body);
  try {
    const data = await Notes.findOne({ _id: req.params.id, user: req.user._id })
      .populate("user")
      .exec();

    if (!data) {
      throw new Error("An error occured while fetching notes.");
    }
    // console.log(data);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occured while fetching notes." });
  }
};

// Create A Note
const createNote = async (req, res) => {
  // console.log(req.body, req.user._id);

  try {
    let data = {
      user: req.user._id,
      // text: req.body["text"],
      text: req.body.text,
    };

    //save to database
    // await Notes.create(data);

    const savedNote = await Notes.create(data);

    if (!data) {
      throw new Error("An error occured while creating a note.");
    }

    //res.status(200).json(data);
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ error: "An error occured while creating a note." });
  }
};

// Update A Note
const updateNote = async (req, res) => {
  // console.log(req.body);
  try {
    // const { text } = req.body;
    // const data = await Notes.findByIdAndUpdate(req.params.id, { text });

    const data = await Notes.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    data.text = req.body.text;
    await data.save();

    if (!data) {
      throw new Error("An error occured while updating a note.");
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occured while updating a note." });
  }
};

// Delete A Note by ID
const deleteNote = async (req, res) => {
  try {
    // console.log(req.params);
    const data = await Notes.deleteOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!data) {
      throw new Error("An error occured while deleting a note.");
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occured while deleting a note." });
  }
};

module.exports = { getAllNotes, getNote, createNote, updateNote, deleteNote };