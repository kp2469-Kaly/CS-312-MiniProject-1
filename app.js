const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let posts = [];
let nextId = 1;

const categories = ['Tech', 'Lifestyle', 'Education', 'Travel', 'Food', 'Sports', 'Other'];

app.get('/', (req, res) => {
    const category = req.query.category;
    let filteredPosts = posts;
    
    if (category && category !== 'all') {
        filteredPosts = posts.filter(post => post.category === category);
    }
    
    res.render('index', { 
        posts: filteredPosts, 
        categories: categories,
        selectedCategory: category || 'all',
        isFiltered: category && category !== 'all',
        categoryName: category
    });
});

app.get('/create', (req, res) => {
    res.render('create', { categories: categories });
});

app.post('/create', (req, res) => {
    const { title, content, author, category } = req.body;
    
    if (!title || !content || !author) {
        return res.render('create', { 
            categories: categories, 
            error: 'Please fill in all required fields' 
        });
    }
    
    const newPost = {
        id: nextId++,
        title: title,
        content: content,
        author: author,
        category: category || 'Other',
        createdAt: new Date()
    };
    
    posts.unshift(newPost); // Add to beginning of array
    res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        return res.redirect('/');
    }
    
    res.render('edit', { post: post, categories: categories });
});

app.post('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const { title, content, author, category } = req.body;
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) {
        return res.redirect('/');
    }
    
    if (!title || !content || !author) {
        const post = posts[postIndex];
        return res.render('edit', { 
            post: post, 
            categories: categories, 
            error: 'Please fill in all required fields' 
        });
    }

    posts[postIndex] = {
        ...posts[postIndex],
        title: title,
        content: content,
        author: author,
        category: category || 'Other',
        updatedAt: new Date()
    };
    
    res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    posts = posts.filter(p => p.id !== postId);
    res.redirect('/');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
