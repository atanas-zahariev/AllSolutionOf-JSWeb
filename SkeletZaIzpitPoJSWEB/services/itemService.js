const Item = require("../models/Item");

async function getAllItems() {
    return Item.find({}).lean()
}

async function getItemById(id) {
    return Item.findById(id).lean()
}

async function createItem(item) {
    return await Item.create(item)
}

async function editItem(itemId, edited) {
    const item = await Item.findById(itemId)

    item.image = edited.image // wrigth all property..

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

async function getItemsBySortedDate(){
    return Item.find({}).sort({date:-1})
    //return sorted data by date in descendig order when is -1 , ascending when is 1
}

async function getItemsSortedByString(){
    return Item.find({}).sort({title:'descending'})
    ///return all Data sorted by specfic fild in descending order when is 'descending',ascending order when is 'ascending'.
}

module.exports = {
    getAllItems,
    getItemById,
    createItem,
    editItem,
    addInCollection,
    deleteItem
}