const Item = require("../models/Item");


async function getAllItem(){
    const Items = await Item.find({}).lean();
    return Items
}

async function getItemById(id){
    const specificItem = await Item.findById(id).populate('buddies').populate('owner').lean();

    return specificItem;
}

async function createItem(sommenthing){
    const created = await Item.create(sommenthing);

    return created;
};

async function editItem(sommenthingId,userInput){
    const existing = await Item.findById(sommenthingId)
    
    existing.startPoint = userInput.startPoint;  
    existing.endPoint = userInput.endPoint;  
    existing.date = userInput.date;  
    existing.time = userInput.time;  
    existing.imgUrl = userInput.imgUrl;  
    existing.brand = userInput.brand;  
    existing.seats = userInput.seats;  
    existing.price = userInput.price;  
    existing.description = userInput.description;  

    await existing.save();
}

async function deleteItem(sommenthingId){
    await Item.findByIdAndDelete(sommenthingId);
}

async function addInCollection(sommenthingId,userid){
    const item = await Item.findById(sommenthingId);

    item.buddies.push(userid)
    item.seats--

    item.save();
}

module.exports = {
    getAllItem,
    getItemById,
    createItem,
    editItem,
    deleteItem,
    addInCollection
}