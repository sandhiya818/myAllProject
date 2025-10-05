const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Note = require("../models/Note");

// ROUTE 1: Fetch all notes
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Add a new note
router.post("/addnotes", fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const note = new Note({
      title,
      description,
      tag,
      user: req.user.id,
    });
    const savedNote = await note.save();
    res.json(savedNote);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 3: Update a note
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    let newNote = {};
    if (title) newNote.title = title;
    if (description) newNote.description = description;
    if (tag) newNote.tag = tag;

    let note = await Note.findById(req.params.id);
    if (!note) return res.status(404).send("Not Found");

    if (note.user.toString() !== req.user.id)
      return res.status(401).send("Not Allowed");

    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json({ note });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 4: Delete a note
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note) return res.status(404).send("Not Found");

    if (note.user.toString() !== req.user.id)
      return res.status(401).send("Not Allowed");

    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: "Note deleted successfully" });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
