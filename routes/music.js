const express = require('express');
const router = express.Router();

router.get('/data', function(req, res, next) {
    req.music.find((docs, err) => {
        if (err===null) {
            // for (let doc of docs) {
            //     console.log(doc);
            //     console.log(Buffer.from(doc.image.data));
            //     doc.image.data = new Buffer.from(doc.image.data.data).toString("base64");
            // }
            // console.log(docs);
            res.send({docs: docs});
            // res.json(docs);
        } else {
            res.send({msg: err});
        }
    });
});

router.get('/data/:category', function(req, res, next) {
    req.music.find({category: req.params.category}, (docs, err) => {
        if (err===null) {
            // for (let doc of docs) {
            //     console.log(doc);
            //     console.log(Buffer.from(doc.image.data));
            //     doc.image.data = new Buffer.from(doc.image.data.data).toString("base64");
            // }
            // console.log(docs);
            res.send({docs: docs});
            // res.json(docs);
        } else {
            res.send({msg: err});
        }
    });
});

router.get('/datacart/:id', function(req, res, next) {
    req.music.findOne({category: req.params.id}, (doc, err) => {
        if (err===null) {
            // for (let doc of docs) {
            //     console.log(doc);
            //     console.log(Buffer.from(doc.image.data));
            //     doc.image.data = new Buffer.from(doc.image.data.data).toString("base64");
            // }
            // console.log(docs);
            res.send({docs: doc});
            // res.json(docs);
        } else {
            res.send({msg: err});
        }
    });
});

module.exports = router;