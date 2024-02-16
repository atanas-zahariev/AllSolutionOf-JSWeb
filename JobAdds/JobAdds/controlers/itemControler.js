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
    const { headline, location, companyName, description } = req.body;

    const item = {
        headline,
        location,
        companyName,
        description,
        owner: req.user._id
    }

    try {
        await createItem(item)
        res.redirect('/jobs/catalog')  // luk for assingment
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

    const isOwner = item.owner?._id == req.user?._id;

    const isTaked = item.collectionProperty.map(x => x._id.toString()).includes(req.user?._id);

    res.render('details', {
        item,
        isOwner,
        isTaked,
        user: req.user
    })
});

itemControler.get('/action/:id', hasUser(), async (req, res) => {
    await addInCollection(req.params.id, req.user._id)

    res.redirect(`/jobs/details/${req.params.id}`)
})

itemControler.get('/edit/:id', hasUser(), async (req, res) => {
    const item = await getItemById(req.params.id);

    res.render('edit', {
        item
    })
})

itemControler.post('/edit/:id', hasUser(), async (req, res) => {
    const item = await getItemById(req.params.id);
    console.log(item);
    if (item.owner._id != req.user._id) {
        return res.redirect('/auth/login')
    }
    const { headline, location, companyName, description } = req.body;


    const edited = {
        headline,
        location,
        companyName,
        description
    }

    try {
        await editItem(item._id, edited)

        res.redirect(`/jobs/details/${req.params.id}`)
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

    res.redirect('/jobs/catalog') //check assingment
})

itemControler.get('/search', (req, res) => {
    res.render('search');
})

itemControler.post('/search', async (req, res) => {
    console.log(req.body.email)
    let items = await getAllItems()
    //console.log(items.map(x => x.owner ? x.owner.email : ''))
    items = items.filter(x => req.body.email == x.owner?.email);
   // console.log(items)
    res.render('search', {
        items,
        search: true,
        email:req.body.email
    })
})

module.exports = itemControler;