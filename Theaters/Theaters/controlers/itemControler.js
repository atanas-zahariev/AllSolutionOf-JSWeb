const { createItem, getAllItems, getItemById, addInCollection, editItem, deleteItem, getItemsBySortedDate, getItemsSortedByString } = require('../services/itemService');
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
};


itemControler.get('/create', async (req, res) => {
    const items = await getItemsBySortedDate();
    //console.log(items);
    const date =  () => (new Date).toISOString().slice(0,10)
    //console.log(date())
    const sortedByTitle = await getItemsSortedByString();
    //console.log(sortedByTitle)
    res.render('create')
})

itemControler.post('/create', async (req, res) => {
    let { title, description, imgUrl, check, date } = req.body;
    if (check == 'on') {
        req.body.check = true
    } else {
        req.body.check = false
    }
    const item = {
        title,
        description,
        imgUrl,
        check: req.body.check,
        date,
        owner: req.user._id
    }

    try {
        await createItem(item)
        res.redirect('/')  
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
    //game.boughtBy.map(x => x.toString()).includes(req.user._id)
    res.render('details', {
        item,
        isOwner,
        isTaked,
        user: req.user
    })
})

itemControler.get('/action/:id', async (req, res) => {
    await addInCollection(req.params.id, req.user._id)

    res.redirect(`/theater/details/${req.params.id}`)
})

itemControler.get('/edit/:id', async (req, res) => {
    const item = await getItemById(req.params.id)
    console.log(item.check)
    res.render('edit',{
        item
    })
})

itemControler.post('/edit/:id', async (req, res) => {
    const item = await getItemById(req.params.id);

    if (item.owner != req.user._id) {
        return res.redirect('/auth/login')
    }
    let { title, description, imgUrl, check} = req.body;

    if(check == 'on'){
        req.body.check = true
    }else{
        req.body.check = false
    }

    const edited = {
        title,
        description,
        imgUrl,
        check:req.body.check
    }
  
    try {
        await editItem(item._id, edited)

        res.redirect(`/theater/details/${req.params.id}`)
    } catch (err) {
        res.render('edit', {
            errors: parseError(err),
            item,
        })
    }
});

itemControler.get('/delete/:id', async (req, res) => {
    const item = await getItemById(req.params.id);

    if (item.owner != req.user._id) {
        return res.redirect('/auth/login')
    }

    await deleteItem(req.params.id)

    res.redirect('/') 
});

itemControler.get('/sortByDate',async (req,res) => {
    const items = await getItemsBySortedDate();

    res.render('user-home',{
        items
    })
})

itemControler.get('/sortByLikes', async (req,res) => {
    let items = await getAllItems();

    items = items.sort((a,b) => b.collectionProperty.length - a.collectionProperty.length);

    res.render('user-home',{
        items
    })
})

module.exports = itemControler;


