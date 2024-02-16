const { createItem, getAllItem, getItemById, wishBook, editItem, deleteItem } = require('../services/itemService');
const errorParser = require('../utyl/parser');

const itemControler = require('express').Router();


itemControler.get('/create', (req, res) => {
    res.render('create')
});

itemControler.post('/create', async (req, res) => {
    const { title, author, genre, stars, image, review } = req.body;
    const book = {
        title,
        author,
        genre,
        stars: Number(stars),
        image,
        review,
        owner: req.user._id
    }
    try {
        await createItem(book)
        res.redirect('/book/catalog')
    } catch (err) {
        res.render('create', {
            error: errorParser(err)
        })

    }
});

itemControler.get('/catalog', async (req, res) => {
    const books = await getAllItem()
    res.render('catalog', {
        books
    })
});

itemControler.get('/details/:id', async (req, res) => {
    const book = await getItemById(req.params.id);
    const isOwner = book.owner == req.user._id
    const isWish = book.wishingList.map(x => x.toString()).includes(req.user._id)
    res.render('details', {
        book,
        isOwner,
        isWish
    })
});

itemControler.get('/wish/:id', async (req, res) => {
    await wishBook(req.params.id, req.user._id)

    res.redirect(`/book/details/${req.params.id}`)
})

itemControler.get('/edit/:id', async (req, res) => {
    const book = await getItemById(req.params.id);
    if (book.owner != req.user._id) {
        return res.redirect('auth/login')
    }

    res.render('edit', {
        book
    });
})

itemControler.post('/edit/:id', async (req, res) => {
    const book = await getItemById(req.params.id);

    const { title, author, genre, stars, image, review } = req.body;

    const edited = {
        title,
        author,
        genre,
        stars,
        image,
        review
    }

    try {
        if (book.owner != req.user._id) {
            return res.redirect('auth/login')
        }

        await editItem(req.params.id, edited)

        res.redirect(`/book/details/${req.params.id}`)
    } catch (err) {
        res.render('edit',{
            book:edited,
            error:errorParser(err)
        })
    }
})

itemControler.get('/delete/:id', async (req, res) => {
    const book = await getItemById(req.params.id);
    if (book.owner != req.user._id) {
        return res.redirect('auth/login')
    }

    await deleteItem(req.params.id);

    res.redirect('/book/catalog');
})

module.exports = itemControler;