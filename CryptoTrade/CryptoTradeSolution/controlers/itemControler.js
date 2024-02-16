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
    const { name, imgUrl, price, description, paymentMethod } = req.body;

    const item = {
        name,
        imgUrl,
        price,
        description,
        paymentMethod,
        owner: req.user._id
    }

    try {
        await createItem(item)
        res.redirect('/crypto/catalog')  // luk for assingment
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
})

itemControler.get('/details/:id', async (req, res) => {
    const item = await getItemById(req.params.id)

    const isOwner = item.owner == req.user?._id;

    const isTaked = item.collectionProperty.map(x => x.toString()).includes(req.user?._id);

    res.render('details', {
        item,
        isOwner,
        isTaked,
        user: req.user
    })
})

itemControler.get('/action/:id', hasUser(), async (req, res) => {
    await addInCollection(req.params.id, req.user._id)

    res.redirect(`/crypto/details/${req.params.id}`)
})

itemControler.get('/edit/:id', hasUser(), async (req, res) => {
    const item = await getItemById(req.params.id);

    res.render('edit', {
        item,
        modifiedOption: createOption(item)
    })
})

itemControler.post('/edit/:id', hasUser(), async (req, res) => {
    const item = await getItemById(req.params.id);

    if (item.owner != req.user._id) {
        return res.redirect('/auth/login')
    }
    const { name, imgUrl, price, description, paymentMethod } = req.body;


    const edited = {
        name,
        imgUrl,
        price,
        description,
        paymentMethod
    }


    try {
        await editItem(item._id, edited)

        res.redirect(`/crypto/details/${req.params.id}`)
    } catch (err) {
        res.render('edit', {
            errors: parseError(err),
            item,
            modifiedOption: createOption(item)
        })
    }
})

itemControler.get('/delete/:id', hasUser(), async (req, res) => {
    const item = await getItemById(req.params.id);

    if (item.owner != req.user._id) {
        return res.redirect('/auth/login')
    }

    await deleteItem(req.params.id)

    res.redirect('/crypto/catalog') //check assingment
})

itemControler.get('/search', async (req, res) => {
    let items = await getAllItems();

    if (req.query.name) {
        items = items.filter(x => x.name.toLowerCase() == req.query.name.toLowerCase())
    }


    items = items.filter(x => x.paymentMethod == req.query.paymentMethod)


    res.render('search', {
        items
    })

})

module.exports = itemControler;