const Item = require("../models/Item");

async function getAllItems() {
    return Item.find({}).lean()
}

async function getItemById(id) {
    return Item.findById(id).lean()
}

async function createItem(item) {
    return await Item.create(item)
};

async function editItem(itemId, edited) {
    const item = await Item.findById(itemId)
    
    item.name = edited.name 
    item.years = edited.years 
    item.kind = edited.kind 
    item.imgUrl = edited.imgUrl 
    item.need = edited.need 
    item.location = edited.location 
    item.description = edited.description 

    return item.save()
}

async function addInCollection(itemId, userId) {
    const item = await Item.findById(itemId)

    if (item.collectionProperty.includes(userId)) {
        return;
    }

    item.collectionProperty.push(userId)

    return item.save()
}

async function deleteItem(id){
    await Item.findByIdAndDelete(id)
}


module.exports = {
    getAllItems,
    getItemById,
    createItem,
    editItem,
    addInCollection,
    deleteItem
}