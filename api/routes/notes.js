const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Note = require('../models/note');

router.get('/',(req,res,next) => {
    Note.find()
    .select('title contents _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            notes: docs
        };
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

router.post('/',(req,res,next) => {
    const note = new Note({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        contents: req.body.contents
    });
    note.save()
    .then(result => {
        res.status(201).json({
            createdNote: {
                title: result.title,
                contents: result.contents,
                _id: result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:noteId',(req,res,next) => {
    const id = req.params.noteId;
    Note.findById(id)
    .select('title contents _id')
    .exec()
    .then(doc => {
        console.log("From Database",doc);
        if (doc) {
        res.status(200).json({
            note: doc
        });
        } else {
            res.status(404).json({message: 'No Valid Entry for the given ID'})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.patch("/:noteId", (req,res,next) => {
    const id = req.params.noteId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Note.update({_id: id},{ $set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Note Updated'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete("/:noteId", (req,res,next) => {
    const id = req.params.noteId;
    Note.remove({_id: id})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'Product Deleted'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;