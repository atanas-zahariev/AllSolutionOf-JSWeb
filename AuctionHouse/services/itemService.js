const Item = require("../models/Item");


async function getAllItem() {
    const Items = await Item.find({}).populate('bider').lean();
    return Items
}

async function getItemById(id) {
    const specificItem = await Item.findById(id).lean();

    return specificItem;
}

async function createItem(sommenthing) {
    const created = await Item.create(sommenthing);

    return created;
}

async function editItem(sommenthingId, userInput) {
    const existing = await Item.findById(sommenthingId)

    existing.title = userInput.title;
    existing.category = userInput.category;
    existing.imgUrl = userInput.imgUrl;
    existing.price = userInput.price || existing.price;
    existing.description = userInput.description;

    await existing.save();
}

async function deleteItem(sommenthingId) {
    await Item.findByIdAndDelete(sommenthingId);
}

async function addInCollection(sommenthingId, userid, offer) {
    const item = await Item.findById(sommenthingId);

    if (offer > item.price) {
        item.price = Number(offer)
        item.bider = userid;

        item.save();
    } else {
        throw new Error('You bid must be higher.')
    }

};

async function closeOffer(id){
    const item = await Item.findById(id);

    item.description = 'isClosed';

    item.save()
}

module.exports = {
    getAllItem,
    getItemById,
    createItem,
    editItem,
    deleteItem,
    addInCollection,
    closeOffer
}