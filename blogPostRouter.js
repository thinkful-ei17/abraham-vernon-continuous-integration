const express = require('express');
const router = express.Router();


const { BlogPosts } = require('./model.js');

BlogPosts.create('How I Became Web-Developer W/ Thinkful', 'Magic Happened.', 'Waer', '12/11/2017');
BlogPosts.create('Bitcoin reach 50,000$', 'Hype Happened.', 'Waer', '12/11/2019');
BlogPosts.create('Programming Becomes Obselete!!!', 'AI Took Over The World - Happened.', 'Waer', '12/11/5000');


router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});
//(title, content, author, publishDate)
router.post('/', (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'publishDate'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
    res.status(201).json(item);
});

router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog posts  item \`${req.params.id}\``);
    res.status(204).end();
});

router.put('/:id', (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'publishDate', 'id'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    if (req.params.id !== req.body.id) {
        const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating blog post item \`${req.params.id}\``);
    //'title', 'content', 'author', 'publishDate'
    BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
        publishDate: req.body.publishDate,
    });
    res.status(204).end();
});

module.exports = router;
