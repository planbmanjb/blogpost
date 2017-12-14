const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const BlogPost = require('./models');

// we're going to add some items to BlogPost
// so there's some data to look ats
console.log("BlogPost", BlogPost);
BlogPost.BlogPosts.create('Mr. Beans', 'fiction', 'Steve', '12/01/2002');
BlogPost.BlogPosts.create('tomatoes', 3);
BlogPost.BlogPosts.create('peppers', 4);

// when the root of this router is called with GET, return
// all current BlogPost items
router.get('/', (req, res) => {
    res.json(BlogPost.BlogPosts.get());
});


// when a new blogpost list item is posted, make sure it's
// got required fields ('name' and 'checked'). if not,
// log an error and return a 400 status code. if okay,
// add new item to BlogPost and return it with a 201.
router.post('/', jsonParser, (req, res) => {
    // ensure `name` and `budget` are in request body
    const requiredFields = ['name', 'checked'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = BlogPost.BlogPosts.create(req.body.name, req.body.checked);
    res.status(201).json(item);
});


// when DELETE request comes in with an id in path,
// try to delete that item from BlogPost.
router.delete('/:id', (req, res) => {
    BlogPost.BlogPosts.delete(req.params.id);
    console.log(`Deleted blogpost list item \`${req.params.ID}\``);
    res.status(204).end();
});

// when PUT request comes in with updated item, ensure has
// required fields. also ensure that item id in url path, and
// item id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `BlogPost.update` with updated item.
router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['name', 'budget', 'id'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        const message = (
            `Request path id (${req.params.id}) and request body id `
            `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating blogpost list item \`${req.params.id}\``);
    const updatedItem = BlogPost.BlogPosts.update({
        id: req.params.id,
        name: req.body.name,
        budget: req.body.budget
    });
    res.status(204).end();
})

module.exports = router;
