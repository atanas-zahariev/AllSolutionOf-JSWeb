const { hasUser } = require('../middlewares/guards');
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


itemControler.get('/create', hasUser(), (req, res) => {
    res.render('create')
})

itemControler.post('/create', hasUser(), async (req, res) => {

    const { title, keyword, location, date, imgUrl, description } = req.body;

    const item = {
        title,
        keyword,
        location,
        date,
        imgUrl,
        description,
        owner: req.user._id
    }

    try {
        await createItem(item)
        res.redirect('/fotos/catalog')  // luk for assingment
    } catch (err) {
        res.render('create', {
            errors: parseError(err)
        })
    }
})

itemControler.get('/catalog', async (req, res) => {
    const items = await getAllItems()

    res.render('catalog', {
        items
    })
});

itemControler.get('/details/:id', async (req, res) => {
    const item = await getItemById(req.params.id)

    const isOwner = item.owner._id == req.user?._id;

    const isTaked = item.collectionProperty.map(x => x._id.toString()).includes(req.user?._id);

    const votedPeople = item.collectionProperty.map(x => x.email).join(', ');

    res.render('details', {
        item,
        isOwner,
        isTaked,
        user: req.user,
        votedPeople
    })
})

itemControler.get('/actionUp/:id', hasUser(), async (req, res) => {

    await addInCollection(req.params.id, req.user._id, true)

    res.redirect(`/fotos/details/${req.params.id}`)
})

itemControler.get('/actionDown/:id', hasUser(), async (req, res) => {

    await addInCollection(req.params.id, req.user._id, false)

    res.redirect(`/fotos/details/${req.params.id}`)
})

itemControler.get('/edit/:id', hasUser(), async (req, res) => {
    const item = await getItemById(req.params.id)
    
    res.render('edit',{
        item
    })
})

itemControler.post('/edit/:id', hasUser(), async (req, res) => {
    const item = await getItemById(req.params.id);

    if (item.owner._id != req.user._id) {
        return res.redirect('/auth/login')
    }
    const { title, keyword, location, date, imgUrl, description } = req.body;


    const edited = {
        title,
        keyword,
        location,
        date,
        imgUrl,
        description
    }

    try {
        await editItem(item._id, edited)

        res.redirect(`/fotos/details/${req.params.id}`)
    } catch (err) {
        res.render('edit', {
            errors: parseError(err),
            item,
        })
    }
})

itemControler.get('/delete/:id', hasUser(), async (req, res) => {
    const item = await getItemById(req.params.id);

    if (item.owner._id != req.user._id) {
        return res.redirect('/auth/login')
    }

    await deleteItem(req.params.id)

    res.redirect('/fotos/catalog') 
})

itemControler.get('/profile', async (req,res) => {
    let items = await getAllItems();

    items = items.filter(x => x.owner._id == req.user._id)

    res.render('profile',{
        items
    })
})

module.exports = itemControler;


