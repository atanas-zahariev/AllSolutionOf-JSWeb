const Item = require("../models/Item");

async function getAllItems() {
    return Item.find({}).populate('owner').lean()
}

async function getItemById(id) {
    return Item.findById(id).populate('owner').populate('collectionProperty').lean()
}

async function createItem(item) {
    return await Item.create(item)
};

async function editItem(itemId, edited) {
    const item = await Item.findById(itemId)
   
    item.title = edited.title 
    item.keyword = edited.keyword 
    item.location = edited.location 
    item.date = edited.date 
    item.imgUrl = edited.imgUrl 
    item.description = edited.description 

    return item.save()
}

async function addInCollection(itemId, userId, boolyan) {
    const item = await Item.findById(itemId)

    if (item.collectionProperty.includes(userId)) {
        return;
    }

    if(boolyan){
        item.raiting++
    }else{
        item.raiting--
        if(item.raiting < 0){
            item.raiting = 0;
        }
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