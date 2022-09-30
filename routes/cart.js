const express = require('express');
const router = express.Router();

router.get('/data/:id', (req, res, next) => {
    if (req.session.userId) {
        let carts = req.cart.find({userId: req.session.userId}).
        populate('musicId').
        populate('userId', '_id, username').
        exec((err, docs) => {
            if (!err) {
                res.send({data: docs});
            } else {
                res.send({data: err});
            }
            // res.send({data: docs});
        });
    } else {
        res.send({data: req.session.cart?req.session.cart:[]});
    }
    
});

router.get('/datacount', (req, res) => {
    if (req.session.userId) {
        let carts = req.cart.find({userId: req.session.userId}, (err, docs) => {
            if (!err) {
                let counts = 0;
                for (let doc of docs) {
                    counts+=doc.quantity;
                }
                res.send({quantity: counts});
            } else {
                res.send({quantity: 0});
            }
        });
    } else {
        if (req.session.cart) {
            let total = 0;
            for (let cart of req.session.cart) {
                total+=parseInt(cart.quantity);
            }
            res.send({quantity: total});
        } else {
            res.send({quantity: 0});
        }
    }
});

router.delete('/data/:id', (req, res, next) => {
    if (req.session.userId) {
        req.cart.findByIdAndDelete(req.params.id, function(err, result) {
            res.send(!err?{msg:''}:{msg:err});
        });
    } else {
        for (let index = 0; index<req.session.cart.length; index++) {
            if (req.session.cart[index]._id===parseInt(req.params.id)) {
                req.session.cart.splice(index, 1);
            }
        }
        res.send({msg:''});
    }
});

router.delete('/deletecart/:userId', (req, res, next) => {
    req.cart.deleteMany({userId: req.params.userId}, (err, result) => {
        if (!err) {
            res.send({msg:''});
        } else {
            res.send({msg:err});
        }
    });
});

module.exports = router;

