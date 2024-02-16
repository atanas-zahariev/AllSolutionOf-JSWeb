const { hasUser } = require('../middlewares/guard');
const { addInCollection, createItem, getAllItem, getItemById, editItem, deleteItem } = require('../services/itemService');
const { getUser } = require('../services/userService');
const errorParser = require('../utyl/parser');

const itemControler = require('express').Router();


itemControler.get('/create', hasUser(), (req, res) => {
    res.render('create')
})

itemControler.post('/create', hasUser(), async (req, res) => {
    console.log(req.body);
    const { startPoint, endPoint, date, time, imgUrl, brand, seats, price, description } = req.body;
    const item = {
        startPoint,
        endPoint,
        date,
        time,
        imgUrl,
        brand,
        seats: Number(seats),
        price: Number(price),
        description,
        owner: req.user._id
    }
    console.log(item);
    try {
        await createItem(item)
        res.redirect('/trips/catalog')
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
});

itemControler.get('/details/:id', async (req, res) => {
    const item = await getItemById(req.params.id);
    const isOwner = item.owner._id == req.user?._id
    const isInCollection = item.buddies.map(x => x._id.toString()).includes(req.user?._id)

    const buddies = item.buddies.map(x => x.email).join(', ')
    const availabelSeats = item.seats > 0

    res.render('details', {
        item,
        isOwner,
        isInCollection,
        buddies,
        user: req.user,
        availabelSeats
    })
});

itemControler.get('/edit/:id', hasUser(), async (req, res) => {
    const item = await getItemById(req.params.id);
    if (item.owner._id != req.user._id) {
        return res.redirect('/auth/login')
    }

    res.render('edit', {
        item
    });
})

itemControler.post('/edit/:id', hasUser(), async (req, res) => {
    const item = await getItemById(req.params.id);

    if (item.owner._id != req.user._id) {
        return res.redirect('/auth/login')
    }
    const { startPoint, endPoint, date, time, imgUrl, brand, seats, price, description } = req.body;

    const edited = {
        startPoint,
        endPoint,
        date,
        time,
        imgUrl,
        brand,
        seats,
        price,
        description
    }

    try {

        await editItem(req.params.id, edited)

        res.redirect(`/trips/details/${req.params.id}`)
    } catch (err) {
        res.render('edit', {
            item: edited,
            error: errorParser(err)
        })
    }
})

itemControler.get('/delete/:id', hasUser(), async (req, res) => {
    const item = await getItemById(req.params.id);
    if (item.owner._id != req.user._id) {
        return res.redirect('/auth/login')
    }

    await deleteItem(req.params.id);

    res.redirect('/trips/catalog');
})

itemControler.get('/userAction/:id', hasUser(), async (req, res) => {

    await addInCollection(req.params.id, req.user._id);

    res.redirect(`/trips/details/${req.params.id}`)

})

itemControler.get('/profile',hasUser(),async (req, res) => {
    const user = await getUser(req.user._id);
    const items = await getAllItem()
    const userTrips = items.filter(x => x.owner == req.user._id)
   
    res.render('profile',{
        user,
        userTrips
    })
})


module.exports = itemControler;