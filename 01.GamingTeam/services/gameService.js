const Game = require("../models/Game");

async function getAllGame(){
    return Game.find({}).lean()
}

async function getGameById(id){
    return Game.findById(id).lean()
}

async function editGame(gameId,editedGame){
    const existingGame = await Game.findById(gameId)

    existingGame.name = editedGame.name;
    existingGame.image = editedGame.image;
    existingGame.price = editedGame.price;
    existingGame.description = editedGame.description;
    existingGame.genre = editedGame.genre;
    existingGame.platform = editedGame.platform;

    await existingGame.save()
}

async function deleteGame(gameId){
    await Game.findByIdAndDelete(gameId);
}

async function buyGame(gameId,userId){
    const existingGame = await Game.findById(gameId)

    if(existingGame.boughtBy.includes(userId)){
        return;
    }

   existingGame.boughtBy.push(userId)

   existingGame.save()
    
};

async function createGame(game){
    return await Game.create(game)
}


module.exports = {
    getAllGame,
    getGameById,
    editGame,
    deleteGame,
    buyGame,
    createGame
}