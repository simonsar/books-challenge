const { body } = require('express-validator');


module.exports = [
    body('name').notEmpty().withMessage('El campo de nombre es obligatorio.'),
    body('email').isEmail().notEmpty().withMessage('El email elegido debe ser válido.'),
    body('country').notEmpty().withMessage('Debes elegir un país de residencia.'),
    body('password').notEmpty().isLength({ min: 8 }).withMessage('La contraseña debe tener un minimo de 8.'),
    body('category').notEmpty().withMessage('Debes elegir una categoría.'),
    
]
