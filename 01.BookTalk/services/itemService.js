const Item = require("../models/Item");


async function getAllItem(){
    const Items = await Item.find({}).lean();
    return Items
}

async function getItemById(id){
    const specificItem = await Item.findById(id).lean();

    return specificItem;
}

async function createItem(sommenthing){
    const created = await Item.create(sommenthing);

    return created;
}

async function editItem(sommenthingId,userInput){
    const existing = await Item.findById(sommenthingId)
    
    existing.title = userInput.title;  
    existing.author = userInput.author;  
    existing.genre = userInput.genre;  
    existing.stars = userInput.stars;  
    existing.image = userInput.image; 
    existing.review = userInput.review;  

    await existing.save();
}

async function deleteItem(sommenthingId){
    await Item.findByIdAndDelete(sommenthingId);
}

async function wishBook(bookId,userId){
    const book =  await Item.findById(bookId);

    if(book.wishingList.includes(userId)){
        return;
    }

    book.wishingList.push(userId);

    await book.save();
}

module.exports = {
    getAllItem,
    getItemById,
    createItem,
    editItem,
    deleteItem,
    wishBook
}