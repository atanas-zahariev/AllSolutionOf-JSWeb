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
    const { title, paintingTech, imgUrl, certificate } = req.body;

    const item = {
        title,
        paintingTech,
        imgUrl,
        certificate,
        owner: req.user._id
    }

    try {
        await createItem(item)
        res.redirect('/galery/catalog')  // luk for assingment
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
    console.log(item);
    const isOwner = item.owner?._id == req.user?._id;

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

    res.redirect(`/`)
})

itemControler.get('/edit/:id', hasUser(), async (req, res) => {
    const item = await getItemById(req.params.id)

    res.render('edit', {
        item
    })
})

itemControler.post('/edit/:id', hasUser(), async (req, res) => {
    const item = await getItemById(req.params.id);

    if (item.owner._id != req.user._id) {
        return res.redirect('/auth/login')
    }
    const { title, paintingTech, imgUrl, certificate } = req.body;


    const edited = {
        title,
        paintingTech,
        imgUrl,
        certificate
    }

    try {
        await editItem(item._id, edited)

        res.redirect(`/galery/details/${req.params.id}`)
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

    res.redirect('/galery/catalog') //check assingment
})

itemControler.get('/profile', hasUser(), async (req, res) => {

    const items = await getAllItems();
    const currentUser = items.map(x => x.owner).filter(x => x._id == req.user._id)[0]
    const userPublication = items.filter(x => x.owner._id == req.user._id)
    //const sharedByUser = items.filter(x =>  x.collectionProperty.find(x => x._id == req.user._id))
    const sharedByUser = items.filter(x => x.collectionProperty.map(x => x.toString()).includes(req.user._id))
    
    res.render('profile',{
        currentUser,
        sharedByUser: sharedByUser.map(x => x.title).join(', '),
        userPublication :userPublication.map(x => x.title).join(', ')
    })
});


module.exports = itemControler;

