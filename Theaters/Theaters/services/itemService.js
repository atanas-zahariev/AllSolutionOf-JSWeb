const Item = require("../models/Item");

async function getAllItems() {
    return Item.find({}).lean()
}

async function getItemsBySortedDate(){
    return Item.find({}).sort({date:-1}).lean()
}

async function getItemsSortedByString(){
    return Item.find({}).sort({title:'ascending'})
}

async function getItemById(id) {
    return Item.findById(id).lean()
}

async function createItem(item) {
    return await Item.create(item)
}

async function editItem(itemId, edited) {
    const item = await Item.findById(itemId)
    
    item.title = edited.title 
    item.description = edited.description 
    item.imgUrl = edited.imgUrl 
    item.check = edited.check 

    return item.save()
};

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
    deleteItem,
    getItemsBySortedDate,
    getItemsSortedByString
}