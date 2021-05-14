const express = require('express');
const { ExpressError } = require('./ExpressError');
const Item = require('./Item');

const items = require('./fakeDb');
const router = express.Router();

router.get('/', (req, res)=>{
    return res.json(items);
});

router.post('/', (req, res) => {
    const name = req.body.name;
    const price = req.body.price;
    if(!name || !price) 
        throw new ExpressError("name and price required", 400);
    const item = new Item(name, price);
    items.push(item.serialize());
    return res.json({added: item.serialize()});
});

router.get('/:name', (req, res, next) => {
    const item = items.find((item) => item.name === req.params.name );
    if (!item) 
        throw new ExpressError("Item Not Found", 404)
    else 
        return res.json(item);
});

router.patch('/:name', (req, res, next) => {
    const name = req.body.name;
    const price = req.body.price;
    const item = items.find((item) => item.name === req.params.name);
    if (!item)
        throw new ExpressError("Item Not Found", 404)
    else{
        if(name){
            item.name = name;
        }
        if(price){
            item.price = price;
        }
        return res.json(item);
    }

});
router.delete('/:name', (req, res, next) => {

});


module.exports = router;