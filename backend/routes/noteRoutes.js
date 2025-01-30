const express = require('express');
const Note = require('../models/Note');
const router = express.Router();

router.post("/" , async(req, res) => {
    try{
        const {title, content} = req.body;
        const newNote = new Note({ title, content });
        await newNote.save();
        res.status(201).json(newNote);
    }
    catch(err){
        res.status(500).json({ message: 'Error creating note', err});
    }
});

router.get("/", async (req, res) => {
    try{
        const notes = await Note.find();
        res.json(notes);
    }
    catch(err){
        res.status(500).json({ message: 'Error fetching notes', err})
    }
});

router.put("/:id", async (req, res) => {
    try{
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedNote);
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating note', err });
    }
});

router.delete('/:id', async (req, res) => {
    try{
        await Note.findByIdAndDelete(req.params.id);
        res.json({ message: 'Note Deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error deleting note', err });
    }
});

module.exports = router;