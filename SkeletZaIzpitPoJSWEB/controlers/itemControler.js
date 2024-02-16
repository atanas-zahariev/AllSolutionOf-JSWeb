const { createItem, getAllItems, getItemById, addInCollection, editItem, deleteItem } = require('../services/itemService');
const { parseError } = require('../util/parser');

const itemControler = require('express').Router();

function createOption(item) {
    const options = {
        "crypto-wallet": 'Crypto Wallet',
        "credit-card": 'Credit Card',
        "debit-card": 'Debit Card',
        "paypal": 'PayPal',
    }
    const modifiedOption = Object.entries(options).map(([key, value]) => ({ key, value, isSelected: item.paymentMethod == key }))

    return modifiedOption;
}


itemControler.get('/create', (req, res) => {
    res.render('create')
})

itemControler.post('/create', async (req, res) => {
    const {/* Some property*/} = req.body;

    const item = {
        //Some property

        owner:req.user._id
    }

    try {
        await createItem(item)
        res.redirect('/')  // luk for assingment
    } catch (err) {
        res.render('create',{
            errors:parseError(err)
        })
    }
})

itemControler.get('/catalog', async (req,res) => {
    const items = await getAllItems()

    res.render('catalog', {
        items
    })
})

itemControler.get('/details/:id', async (req,res) => {
    const item = await getItemById(req.params.id)

    const isOwner = item.owner == req.user?._id;

    const isTaked = item.collectionProperty.map(x => x.toString()).includes(req.user?._id);
                            //game.boughtBy.map(x => x.toString()).includes(req.user._id)
    res.render('details', {
        item,
        isOwner,
        isTaked
    })
})

itemControler.get('/action/:id',async (req, res) => {
     await addInCollection(req.params.id,req.user._id)

     res.redirect(`/....?/details/${req.params.id}`)
})

itemControler.get('/edit/:id', (req, res) => {
    res.render('edit')
})

itemControler.post('/edit/:id', async (req, res) => {
    const item = await getItemById(req.params.id);

    if (item.owner != req.user._id) {
        return res.redirect('/auth/login')
    }
    const {/* Some property*/} = req.body;

    const edited = {
        //Some property
    }

    try {
        await editItem(item._id, edited)

        res.redirect(`/....?/details/${req.params.id}`)
    } catch (err) {
        res.render('edit', {
            errors: parseError(err),
            item,
        })
    }
})

itemControler.get('/delete/:id', async (req, res) => {
    const item = await getItemById(req.params.id);

    if (item.owner != req.user._id) {
        return res.redirect('/auth/login')
    }

    await deleteItem(req.params.id)

    res.redirect('/') //check assingment
})

module.exports = itemControler;


