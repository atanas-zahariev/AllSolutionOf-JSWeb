const { createItem, getItemById, enrolUser, editItem, deleteItem } = require('../services/itemService');
const errorParser = require('../utyl/parser');

const itemControler = require('express').Router();


itemControler.get('/create', (req, res) => {
    res.render('create-course')
});

itemControler.post('/create', async (req, res) => {
    const { title, description, imgUrl, duration } = req.body
    const course = {
        title,
        description,
        imgUrl,
        duration,
        owner: req.user._id
    }
    try {
        await createItem(course)
        res.redirect('/')
    } catch (err) {
        res.render('create-course', {
            error: errorParser(err),
            body: course
        })
    }
})

itemControler.get('/details/:id', async (req, res) => {
    const course = await getItemById(req.params.id);

    if (course.owner.toString() == req.user._id) {
        course.isOwner = true;
    }
    if(course.enrolledUsers.map(x => x.toString()).includes(req.user._id)){
        course.isEnroled = true;
    }
    res.render('course-details', {
        course
    })
})

itemControler.get('/enrol/:id', async (req, res) => {
    const course = await getItemById(req.params.id);
    
    if(course.enrolledUsers.map(x => x.toString()).includes(req.user._id)){
        res.redirect(`/course/details/${course._id}`);
        
    }else{
        
        await enrolUser(req.params.id, req.user._id);

        res.redirect(`/course/details/${course._id}`);
    }
});

itemControler.get('/edit/:id', async (req, res) => {
    const course = await getItemById(req.params.id);

    if(course.owner.toString() != req.user._id){
        return res.redirect('/auth/login')
    }

    res.render('edit-course', {
        course
    })
})

itemControler.post('/edit/:id', async (req,res) => {
    const course = await getItemById(req.params.id);

    const {title,description,imgUrl,duration} = req.body;

    const edited = {
        title,
        description,
        imgUrl,
        duration
    }

    try{
        if(course.owner.toString() != req.user._id){
            return res.redirect('/auth/login')
        }
        await editItem(req.params.id, edited)
        res.redirect(`/course/details/${req.params.id}`)
    }catch(err){
       res.render('edit-course',{
        course:edited,
        error:errorParser(err)
       })
    }

})

itemControler.get('/delete/:id', async (req, res) => {
    const course = await getItemById(req.params.id);

    if(course.owner.toString() != req.user._id){
        return res.redirect('/auth/login')
    }

    await deleteItem(req.params.id);

    res.redirect('/')

})

module.exports = itemControler;