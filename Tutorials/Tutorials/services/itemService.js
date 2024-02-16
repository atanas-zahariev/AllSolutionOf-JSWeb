const Item = require("../models/Item");


async function getAllItem(search){
    const query = {}
    if(search){
        query.title = new RegExp(search,'i')
    }
    return Item.find(query).sort({createdAt: 1}).lean()
};

async function getAllItemByCount(){
    const items = await Item.find({}).lean();
    items.sort((a,b) => a.enrolledUsers.length - b.enrolledUsers.length);
    return items;
};

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
    existing.description = userInput.description;  
    existing.imgUrl = userInput.imgUrl;  
    existing.duration = userInput.duration;  

    await existing.save();
}

async function deleteItem(sommenthingId){
    await Item.findByIdAndDelete(sommenthingId);
}

async function enrolUser(courseId, userId){
    const course = await Item.findById(courseId);

    course.enrolledUsers.push(userId);

    await course.save();
}

module.exports = {
    getAllItem,
    getAllItemByCount,
    getItemById,
    createItem,
    editItem,
    deleteItem,
    enrolUser
}