const { hasUser } = require('../middlewares/guard');
const User = require('../models/User');
const { addInCollection, createItem, getAllItem, getItemById, editItem, deleteItem, closeOffer } = require('../services/itemService');
const errorParser = require('../utyl/parser');

const itemControler = require('express').Router();


itemControler.get('/create', hasUser(), (req, res) => {
    res.render('create')
})

itemControler.post('/create', hasUser(), async (req, res) => {
    const { title, category, imgUrl, price, description } = req.body;
    const item = {
        title,
        category,
        imgUrl,
        price: Number(price),
        description,
        owner: req.user._id
    }
    try {
        await createItem(item)
        res.redirect('/house/catalog')
    } catch (err) {
        res.render('create', {
            error: errorParser(err)
        })

    }
})

itemControler.get('/catalog', async (req, res) => {
    let items = await getAllItem();
    items = items.filter( x => x.description != 'isClosed')
    res.render('catalog', {
        items
    })
})

itemControler.get('/details/:id', async (req, res) => {

    const item = await getItemById(req.params.id);
    if (req.user) {
        const isOwner = item.owner == req.user._id


        if (isOwner) {
            const bider = await User.findById(item.bider?.toString()).lean()
            res.render('details-owner', {
                item,
                bider,
            })
        } else {
            try {
                if (req.query.price) {
                    await addInCollection(item._id, req.user._id, req.query.price)
                }
                const itemWithBider = await getItemById(req.params.id);

                const currentHigherOffer = itemWithBider.bider == req.user._id;

                res.render('details', {
                    item: itemWithBider,
                    currentHigherOffer,
                    username: req.user.username
                })
            } catch (err) {
                const currentHigherOffer = item.bider == req.user._id;

                res.render('details', {
                    item,
                    currentHigherOffer,
                    username: req.user.username,
                    error: errorParser(err)
                })
            }
        }

    } else {
        res.render('details', {
            item
        })
    }

})

itemControler.get('/edit/:id', hasUser(), async (req, res) => {
    const item = await getItemById(req.params.id);

    if (item.owner != req.user._id) {
        return res.redirect('/auth/login')
    }

    const option = {
        'estate': 'Real Estate',
        'vehicles': 'Vehicles',
        'furniture': 'Furniture',
        'electronics': 'Electronics',
        'other': 'Other'
    }

    const optionMethods = Object.keys(option).map(key => ({
        key,
        label: option[key],
        isSelected: item.category == key
    }));

    const bider = item.bider
    res.render('edit', {
        item,
        bider,
        optionMethods
    });
})

itemControler.post('/edit/:id', hasUser(), async (req, res) => {
    const item = await getItemById(req.params.id);

    if (item.owner != req.user._id) {
        return res.redirect('/auth/login')
    }

    const { title, category, imgUrl, price, description } = req.body;

    const edited = {
        title,
        category,
        imgUrl,
        price,
        description
    }

    try {

        await editItem(req.params.id, edited)

        res.redirect(`/house/details/${req.params.id}`)
    } catch (err) {
        res.render('edit', {
            item: edited,
            error: errorParser(err)
        })
    }
})

itemControler.get('/delete/:id', hasUser(), async (req, res) => {
    const item = await getItemById(req.params.id);

    if (item.owner != req.user._id) {
        return res.redirect('/auth/login')
    }
    await deleteItem(req.params.id);

    res.redirect('/house/catalog');
})

itemControler.get('/userAction/:id', async (req, res) => {
    await closeOffer(req.params.id)

    res.redirect(`/house/closed`)

});

itemControler.get('/closed', async (req, res) => {

    let items = await getAllItem()
    
    items = items.filter(x => x.description == 'isClosed' && x.owner.toString() == req.user._id);
    

    res.render('closed-auctions',{
        items
    })
});


module.exports = itemControler;