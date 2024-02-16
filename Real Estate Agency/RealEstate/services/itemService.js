const Item = require("../models/Item");


async function getAllItem(){
    const Items = await Item.find({}).lean();
    return Items
}

async function getItemById(id){
    const specificItem = await Item.findById(id).populate('rentedAHome').lean();

    return specificItem;
}

async function createItem(sommenthing){
    const created = await Item.create(sommenthing);

    return created;
}

async function editItem(sommenthingId,userInput){
    const existing = await Item.findById(sommenthingId)
    
    existing.name = userInput.name;
    existing.type = userInput.type;
    existing.year = userInput.year;
    existing.city = userInput.city;
    existing.imgUrl = userInput.imgUrl;
    existing.description = userInput.description;
    existing.availablePieces = userInput.availablePieces;

    await existing.save();
}

async function deleteItem(sommenthingId){
    await Item.findByIdAndDelete(sommenthingId);
}

async function addInCollection(sommenthingId,userid){
    const item = await Item.findById(sommenthingId);

    item.rentedAHome.push(userid)
    item.availablePieces--

    item.save();
};

module.exports = {
    getAllItem,
    getItemById,
    createItem,
    editItem,
    deleteItem,
    addInCollection
}