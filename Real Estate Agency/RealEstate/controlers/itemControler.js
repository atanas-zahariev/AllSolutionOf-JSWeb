const { hasUser } = require('../middlewares/guard');
const { addInCollection, createItem, getAllItem, getItemById, editItem, deleteItem } = require('../services/itemService');
const errorParser = require('../utyl/parser');

const itemControler = require('express').Router();


itemControler.get('/create', hasUser(), (req, res) => {
    res.render('create')
});

itemControler.post('/create', hasUser(), async (req, res) => {
    const { name, type, year, city, imgUrl, description, availablePieces } = req.body;
    const item = {
        name,
        type,
        year,
        city,
        imgUrl,
        description,
        availablePieces: Number(availablePieces),
        owner: req.user._id
    }
    try {
        await createItem(item)
        res.redirect('/catalog')
    } catch (err) {
        res.render('create', {
            error: errorParser(err)
        })

    }
});

itemControler.get('/catalog', async (req, res) => {
    const items = await getAllItem()
    res.render('catalog', {
        items
    })
})

itemControler.get('/details/:id', async (req, res) => {
    const item = await getItemById(req.params.id);

    const isOwner = item.owner == req.user?._id

    const isInCollection = item.rentedAHome.map(x => x._id.toString()).includes(req.user?._id)

    const people = item.rentedAHome.map(x => x.name).join(', ')

    const isAvailable = item.availablePieces > 0

    res.render('details', {
        item,
        isOwner,
        isAvailable,
        people,
        user: req.user,
        isInCollection
    })
});

itemControler.get('/edit/:id', hasUser(), async (req, res) => {
    const item = await getItemById(req.params.id);
    if (item.owner != req.user._id) {
        return res.redirect('/auth/login')
    }

    res.render('edit', {
        item
    });
})

itemControler.post('/edit/:id', hasUser(), async (req, res) => {
    const item = await getItemById(req.params.id);

    if (item.owner != req.user._id) {
        return res.redirect('/auth/login')
    }
    const { name, type, year, city, imgUrl, description, availablePieces } = req.body;


    const edited = {
        name,
        type,
        year,
        city,
        imgUrl,
        description,
        availablePieces
    }

    try {

        await editItem(req.params.id, edited)

        res.redirect(`/details/${req.params.id}`)
    } catch (err) {
        res.render('edit', {
            item: edited,
            error: errorParser(err)
        })
    }
});

itemControler.get('/delete/:id', hasUser(), async (req, res) => {
    const item = await getItemById(req.params.id);
    if (item.owner != req.user._id) {
        return res.redirect('/auth/login')
    }

    await deleteItem(req.params.id);

    res.redirect('/catalog');
})

itemControler.get('/userAction/:id', hasUser(), async (req, res) => {
    await addInCollection(req.params.id, req.user._id);

    res.redirect(`/details/${req.params.id}`)

})

itemControler.get('/search', async (req, res) => {
    const items = await getAllItem()

    let sorted;

    if (req.query.type) {
        sorted = items.filter(x => x.type.toLowerCase() == req.query.type.toLowerCase())
    }

    res.render('search', {
        sorted,
        query: req.query.type || req.query.type == ''
    })
});


module.exports = itemControler;