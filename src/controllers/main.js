const bcryptjs = require('bcryptjs');
const db = require('../database/models');
const { Op } = require("sequelize");

const mainController = {
  home: (req, res) => {
    db.Book.findAll({
      include: [{ association: 'authors' }]
    })
      .then((books) => {
        res.render('home', { books });
      })
      .catch((error) => console.log(error));
  },
  bookDetail: (req, res) => {
    db.Book.findByPk(req.params.id, {include: [{association: "authors"}]})
      .then((book)=> {
         res.render('bookDetail', {book: book});
      })
    
  },
  bookSearch: (req, res) => {
    res.render('search', { books: [] });
  },
  
  bookSearchResult: (req, res) => {
    db.Book.findAll({
      where: {
        title: {
          [Op.like]: `%${req.body.title}%`
        }
      }
    }).then(
      (response) => {
        res.render('search', { books: response })
      }
    );
  },

  deleteBook: (req, res) => {
    // Implement delete book
    db.Book.destroy({
      where: {
          id: req.params.id
      }
    }).then(()=>{
      res.redirect('/');
    
    })
  },

  authors: (req, res) => {
    db.Author.findAll()
      .then((authors) => {
        res.render('authors', { authors });
      })
      .catch((error) => console.log(error));
  },

  authorBooks: (req, res) => {
    // Implement books by author

    db.Author.findByPk(req.params.id, {include: [{association: "books"}]})
    .then((booksByAuthor) => {
        res.render('authorBooks', { booksByAuthor});
      })
    
  },
  register: (req, res) => {
    res.render('register');
  },
  processRegister: (req, res) => {
    db.User.create({
      Name: req.body.name,
      Email: req.body.email,
      Country: req.body.country,
      Pass: bcryptjs.hashSync(req.body.password, 10),
      CategoryId: req.body.category
    })
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => console.log(error));
  },
  login: (req, res) => {
    // Implement login process
    res.render('login');
  },
  processLogin: (req, res) => {
    // Implement login process
    res.render('home');
  },
  edit: (req, res) => {
    // Implement edit book
    db.Book.findByPk(req.params.id)
            .then((book)=> {
              res.render('editBook', {book:book})
            })
  },
  processEdit: (req, res) => {
    // Implement edit book 
    if(req.file){
      db.Book.update({ 
        title: req.body.title,
        cover : req.file.filename,
        description: req.body.description
        },{
            where: {
              id: req.params.id
            }
          })
          .then(()=>{
            res.redirect('/books/detail/' + req.params.id)
          }) 
    }else{
      db.Book.update({ 
        title: req.body.title,
        description: req.body.description
        },{
            where: {
              id: req.params.id
            }
          })
          .then(()=>{
            res.redirect('/books/detail/' + req.params.id)
          }) 
    }
  }
};

module.exports = mainController;
