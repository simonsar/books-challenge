const bcryptjs = require('bcryptjs');
const db = require('../database/models');
const { Op, where } = require("sequelize");
const {validationResult} = require('express-validator');

const mainController = {
  home: (req, res) => {
    db.Book.findAll({
      include: [{ association: 'authors' }]
    })
      .then((books) => {
        res.render('home', { books, isLoging: req.cookies.email?true:false });
      })
      
  },
  bookDetail: (req, res) => {
    db.Book.findByPk(req.params.id, {include: [{association: "authors"}]})
      .then((book)=> {
        let isLoging = req.cookies.email?true:false
        let catId = null 
        if(isLoging){
          db.User.findOne({
            where: {
              Email: {
                [Op.eq]: req.cookies.email
              }
            }
          }).then((user)=>{
            res.render('bookDetail', {book: book, isLoging: req.cookies.email?true:false, catId: user.CategoryId})
          })
            
          
        }else{
          res.render('bookDetail', {book: book, isLoging: req.cookies.email?true:false, catId: null});
        }
      })
    
  },
  bookSearch: (req, res) => {
    res.render('search', { books: [],  isLoging: req.cookies.email?true:false});
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
        res.render('search', { books: response, isLoging: req.cookies.email?true:false })
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
        res.render('authors', { authors, isLoging: req.cookies.email?true:false });
      })
  },

  authorBooks: (req, res) => {
    // Implement books by author

    db.Author.findByPk(req.params.id, {include: [{association: "books"}]})
    .then((booksByAuthor) => {
        res.render('authorBooks', { booksByAuthor, isLoging: req.cookies.email?true:false});
      })
    
  },
  register: (req, res) => {
    res.render('register', {isLoging: false});
  },
  processRegister: (req, res) => {
    let errors = validationResult(req);
    db.User.findOne({where:{email: req.body.email}})
    .then((user)=>{
      if(errors.isEmpty() && user == null){
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
      } else{
          res.render('register', {
            errors: errors.array(),
            isLoging: false
          });
        }
    })
  },
  login: (req, res) => {
    // Implement login process
    res.render('login', {
      error: {
          msg: null
      }, 
      isLoging: false
    });
  },
  processLogin: (req, res) => {
    // Implement login process
    db.User.findOne({
      where:{Email: req.body.email}
    })
    .then(user=>{
        if(user){
          if (!bcryptjs.compareSync(req.body.password, user.Pass)){
              return res.render('login',{
                  error: {
                      msg: 'La contraseña no es correcta'
                  }, 
                  isLoging: false
              })
          }
          if (req.body) {
              res.cookie('email', req.body.email, {maxAge: 1000*60*60*24})
          }
          res.redirect('/')
          
        }else{
          return res.render('login',{
              error: {
                  msg: 'Email no registrado'
              },
              isLoging: false
          })
        }
    })
    
  },
  edit: (req, res) => {
    // Implement edit book
    db.Book.findByPk(req.params.id)
            .then((book)=> {
              res.render('editBook', {book:book, isLoging: req.cookies.email?true:false})
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
