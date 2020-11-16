const express = require('express');
const passport = require('passport');

const { isAuthenticated } = require('../middlewares/authentication.middleware');

// Importo modelo de usuario
const User = require('../models/User');

// Verifico que llega todo limpio
const cleanPayload = require('../utils/clean-payload');

// Paquete que hashea las contraseñas
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Middleware para subir las imágenes ↓
const imagesMiddleware = require('../middlewares/file.middleware');

// Validación de datos antes de escribirse en la DB
const validateData = (req, res, next) => {
  if (
    typeof req.body.username === 'undefined' ||
    typeof req.body.name === 'undefined' ||
    typeof req.body.email === 'undefined' ||
    typeof req.body.password === 'undefined' ||
    typeof req.body.eula === 'undefined' ||
    typeof req.body.city === 'undefined' ||
    typeof req.body.zipCode === 'undefined' ||
    typeof req.body.role === 'undefined'
  ) {
    res
      .status(400)
      .send('Faltan argumentos compa. No me estás enviando campos requeridos en la BBDD.');
    return;
  }

  next();
};

const router = express.Router();

//////////// GET PARA VER USUARIOS /////////////////////////////

router.get('/', (req, res) => {
  User.find({})
    .then((user) => {
      return res.json(user);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
});

// router.get(
//   '/google',
//   passport.authenticate('google', {
//     scope: ['profile', 'email'],
//   }),
// );

//////////// GET PARA VER USUARIO (POR ID) /////////////////////////////

router.get('/:id', (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then((user) => {
      return res.json(user);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
});

//////////// POST PARA REGISTRAR USUARIOS //////////////////////////////

router.post('/register', passport.authenticate('register'), (req, res) =>
  res.status(200).json({ data: req.user }),
);

//////////// POST PARA LOGUEAR USUARIOS ///////////////////////////////

router.post('/login', passport.authenticate('login'), (req, res) =>
  res.status(200).json({ data: req.user }),
);

//////////// PUT PARA ACTUALIZAR USUARIOS /////////////////////////////

router.put('/:id', imagesMiddleware.upload.single('avatar'), (req, res) => {
  const id = req.params.id;

  const updateUser = cleanPayload({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    eula: req.body.eula,
    city: req.body.city,
    zipCode: req.body.zipCode,
    avatar: '/uploads/' + req.file.filename,
    formHistory: req.body.formHistory,
    favorites: req.body.formHistory,
    address: req.body.address,
    contactPhone: req.body.contactPhone,
    role: req.body.role,
  });

  User.findByIdAndUpdate(id, updateUser)
    .then((preStoredUser) => {
      console.log(preStoredUser);
      res.status(200).send('Todo actualizado correctamente.');
    })
    .catch((error) => {
      console.log(error.message);
      res.status(500).send('Error al actualizar el usuario.');
    });
});

//////////// DELETE PARA BORRAR USUARIOS /////////////////////////////

router.delete('/:id', (req, res) => {
  const id = req.params.id;

  User.findByIdAndDelete(id)
    .then(() => {
      return res.send('Usuario borrado con éxito');
    })
    .catch((error) => {
      console.log(error.message);
      return res.status(500).send('No se ha podido borrar el usuario');
    });
});

//////////// GET PARA CERRAR SESION /////////////////////////////

router.get('/logout', (req, res) => {
  // Logout using the passport added logout method
  req.logout();

  // Send user to check if it's really logged out
  res.status(200).json({ data: 'OK' });
});

module.exports = router;
