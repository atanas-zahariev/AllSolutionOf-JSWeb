const Item = require("../models/Item");

async function getAllItems(name,paymentMethod) {
    // if(name || paymentMethod){
    //     const expressions = []

    //     if(name){
    //         expressions.push({'name':{$regex: `${name}`, $options:`i`}})
    //     }

    //     if(paymentMethod){
    //         expressions.push({'paymentMethod':{$regex: `${paymentMethod}`, $options:`i`}})

    //     }

    //     return Item.find({$and:expressions}).lean()

    // }else{

    //     return Item.find({}).lean()
    // }
    return Item.find({}).lean()
};

async function getItemById(id) {
    return Item.findById(id).lean()
}

async function createItem(item) {
    return await Item.create(item)
}

async function editItem(itemId, edited) {
    const item = await Item.findById(itemId)
    
    item.name = edited.name
    item.imgUrl = edited.imgUrl 
    item.price = edited.price
    item.description = edited.description
    item.paymentMethod = edited.paymentMethod

    return item.save()
}

async function addInCollection(itemId, userId) {
    const item = await Item.findById(itemId)

    if (item.collectionProperty.includes(userId)) {
        return;
    }

    item.collectionProperty.push(userId)

    return item.save()
};

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