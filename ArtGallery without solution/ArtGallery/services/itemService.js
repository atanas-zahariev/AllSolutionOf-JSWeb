const Item = require("../models/Item");

async function getAllItems() {
    return Item.find({}).populate('owner').lean()
}

async function getItemById(id) {
    return Item.findById(id).populate('owner').lean()
}

async function createItem(item) {
    return await Item.create(item)
}

async function editItem(itemId, edited) {
    const item = await Item.findById(itemId)
    //const {title,paintingTech,imgUrl,certificate} = req.body;

    item.title = edited.title
    item.paintingTech = edited.paintingTech
    item.imgUrl = edited.imgUrl
    item.certificate = edited.certificate

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

async function deleteItem(id) {
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