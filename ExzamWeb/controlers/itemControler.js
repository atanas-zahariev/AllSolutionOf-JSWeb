const { hasUser } = require('../middlewares/guards');
const { createItem, getAllItems, getItemById, addInCollection, editItem, deleteItem } = require('../services/itemService');
const { parseError } = require('../util/parser');

const itemControler = require('express').Router();

itemControler.get('/create',hasUser(), (req, res) => {
    res.render('create')
})

itemControler.post('/create',hasUser(), async (req, res) => {
    const {name,years,kind,imgUrl,need,location,description} = req.body;

    const item = {
        name,
        years,
        kind,
        imgUrl,
        need,
        location,
        description,
        owner:req.user._id
    }

    try {
        await createItem(item)
        res.redirect('/world/catalog')  
    } catch (err) {
        res.render('create',{
            errors:parseError(err)
        })
    }
});

itemControler.get('/catalog', async (req,res) => {
    const items = await getAllItems()

    res.render('catalog', {
        items
    })
});

itemControler.get('/details/:id', async (req,res) => {
    const item = await getItemById(req.params.id)

    const isOwner = item.owner == req.user?._id;

    const isTaked = item.collectionProperty.map(x => x.toString()).includes(req.user?._id);
                           
    res.render('details', {
        item,
        isOwner,
        isTaked,
        user:req.user
    })
})

itemControler.get('/action/:id',hasUser(),async (req, res) => {
     await addInCollection(req.params.id,req.user._id)

     res.redirect(`/world/details/${req.params.id}`)
})

itemControler.get('/edit/:id',hasUser(),async (req, res) => {
    const item = await getItemById(req.params.id)

    res.render('edit',{
        item
    })
})

itemControler.post('/edit/:id',hasUser(), async (req, res) => {
    const item = await getItemById(req.params.id);

    if (item.owner != req.user._id) {
        return res.redirect('/auth/login')
    }
    const {name,years,kind,imgUrl,need,location,description} = req.body;


    const edited = {
        name,
        years,
        kind,
        imgUrl,
        need,
        location,
        description
    }

    try {
        await editItem(item._id, edited)

        res.redirect(`/world/details/${req.params.id}`)
    } catch (err) {
        res.render('edit', {
            errors: parseError(err),
            item,
        })
    }
})

itemControler.get('/delete/:id',hasUser(), async (req, res) => {
    const item = await getItemById(req.params.id);

    if (item.owner != req.user._id) {
        return res.redirect('/auth/login')
    }

    await deleteItem(req.params.id)

    res.redirect('/world/catalog') 
})

itemControler.get('/search',async (req,res) => {
    let items = await getAllItems()
    
    res.render('search',{
        items
    })
})

itemControler.post('/search',async (req,res) => {
    let items = await getAllItems()

    items = items.filter(x => x.location.toLowerCase().includes(req.body.location.toLowerCase()));

    res.render('search',{
        items
    })
})

module.exports = itemControler;


