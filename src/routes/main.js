const express = require('express');
const mainController = require('../controllers/main');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, path.join(__dirname, '../../public/img'))

    },

    filename: (req, file, cb) => {
        const newFileName = 'bookCover' + Date.now() + path.extname(file.originalname);
        cb(null, newFileName )
    }
})
const upload = multer({ storage })


router.get('/', mainController.home);
router.get('/books/detail/:id', mainController.bookDetail);
router.get('/books/search', mainController.bookSearch);
router.post('/books/search', mainController.bookSearchResult);
router.get('/authors', mainController.authors);
router.get('/authors/:id/books', mainController.authorBooks);
router.get('/users/register', mainController.register);
router.post('/users/register', mainController.processRegister);
router.get('/users/login', mainController.login);
router.post('/users/login', mainController.processLogin);
router.delete('/books/:id', mainController.deleteBook);
router.get('/books/edit/:id', mainController.edit);
router.put('/books/edit/:id', upload.single('cover'), mainController.processEdit);

module.exports = router;
