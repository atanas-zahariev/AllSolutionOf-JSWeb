const { createGame, getAllGame, getGameById, buyGame, editGame, deleteGame } = require('../services/gameService');
const { parseError } = require('../util/parser');

const gameControler = require('express').Router();

const platformOptions = {
    '': '-------',
    PC: 'PC',
    Nintendo: 'Nintendo',
    PS4: 'PS4',
    PS5: 'PS5',
    XBOX: 'XBOX',
}

const options = Object.keys(platformOptions).map(key => ({
    key,
    label: platformOptions[key],
    isSelected: false
}))

function makeOptionIsSelectedToFalse() {
    options.forEach(op => {
        op.isSelected = false;
    })
}

function makeOptionIsSelected(game) {
    for (let op of options) {
        if (op.key == game.platform) {
            op.isSelected = true;
        }
    }
}

gameControler.get('/create', (req, res) => {
    makeOptionIsSelectedToFalse()

    res.render('create', {
        options
    })
});

gameControler.post('/create', async (req, res) => {
    const { platform, name, image, price, genre, description } = req.body;

    const game = {
        platform,
        name,
        image,
        price,
        genre,
        description,
        owner: req.user._id
    }

    try {
        await createGame(game)
        res.redirect('/game/catalog')
    } catch (err) {

        makeOptionIsSelected(game)

        res.render('create', {
            errors: parseError(err),
            options,
            game
        })
    }
})

gameControler.get('/catalog', async (req, res) => {
    const games = await getAllGame()
    res.render('catalog', {
        games
    })
})

gameControler.get('/details/:id', async (req, res) => {
    const game = await getGameById(req.params.id);

    const isOwner = game.owner == req.user._id;
    const isBuy = game.boughtBy.map(x => x.toString()).includes(req.user._id)
    res.render('details', {
        game,
        isOwner,
        isBuy
    })
})

gameControler.get('/buy/:id', async (req, res) => {
    await buyGame(req.params.id, req.user._id);

    res.redirect(`/game/details/${req.params.id}`)
})

gameControler.get('/edit/:id', async (req, res) => {
    const game = await getGameById(req.params.id);

    if (game.owner != req.user._id) {
        return res.redirect('/auth/login')
    }

    makeOptionIsSelectedToFalse()

    makeOptionIsSelected(game)

    res.render('edit', {
        game,
        options
    })

})

gameControler.post('/edit/:id', async (req, res) => {
    const game = await getGameById(req.params.id);

    if (game.owner != req.user._id) {
        return res.redirect('/auth/login')
    }
    const { platform, name, image, price, genre, description } = req.body;

    const edited = {
        platform,
        name,
        image,
        price,
        genre,
        description
    }

    try {
        await editGame(game._id, edited)

        res.redirect(`/game/details/${req.params.id}`)
    } catch (err) {
        res.render('edit', {
            errors: parseError(err),
            game,
            options
        })
    }

})

gameControler.get('/delete/:id', async (req, res) => {
    const game = await getGameById(req.params.id);

    if (game.owner != req.user._id) {
        return res.redirect('/auth/login')
    }

    await deleteGame(req.params.id);

    res.redirect(`/game/catalog/`)
})

gameControler.get('/search', async (req, res) => {
    let games = await getAllGame()

    const { name, platform } = req.query;

    if (name) {
        games = games.filter(game => game.name == name)
    }

    if (platform) {
        games = games.filter(game => game.platform == platform)
    }

    res.render('search', {
        games
    })
})

module.exports = gameControler;