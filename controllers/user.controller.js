const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const { validatePassword } = require('../validators/validators')
// Configurar JWT
const JWT_SECRET = 'tu_super_secreto' // Este debe estar en una variable de entorno
const JWT_EXPIRES_IN = '90d'

const userController = {

  // Registro de usuario
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body

      const newUser = new User({
        name,
        email,
        password: password,
        role: 'user' //La unica forma de definir un admin es desde dentro de la propia base de datos
      })

      //validar Email y contraseña
      const valEmail = await validateEmailBD(req.body.email)
      console.log(valEmail) //Devuelve null si no encuentra el Email en la BD
      if (!valEmail) {
        //La contraseña debe cumplir con el patron requerido
        const valPassword = validatePassword(req.body.password)
        if (valPassword) {
          //Encriptar la contraseña antes de hacer el registro
          newUser.password = bcrypt.hashSync(newUser.password, 10)
          await newUser.save()
          // devolver respuesta (1.3)
          res
            .status(201)
            .send({
              message: 'Usuario registrado con éxito',
              userId: newUser._id
            })
        } else {
          return res.status(200).json({
            success: false,
            message: 'La contraseña no cumple con los parametros'
          })
        }
      }
      return res.status(200).json({
        success: false,
        message: 'El correo ya está registrado'
      })
    } catch (error) {
      // devolver respuesta (1.3)
      console.log(error)
      res
        .status(500)
        .json({
          message: 'Error al registrar el usuario',
          error: error.message
        })
    }
  },

  // Inicio de sesión
  login: async (req, res) => {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email })

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(401).json({ message: 'Contraseña incorrecta' })
      }

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
      })

      res.status(200).json({ message: 'Login exitoso', token, id: user._id })
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error en el login', error: error.message })
    }
  },

  // Actualizar perfil del usuario
  updateProfile: async (req, res) => {
    try {
      const { userId } = req.params
      const { name, password } = req.body

//se checkea la contraseña
  const valPassword = validatePassword(password)
  if (valPassword) {
    //Encriptar la contraseña antes de hacer el update
    password = bcrypt.hashSync(password, 10)
    
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, password },
        { new: true }
      )

      if (!updatedUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
      }

      res
        .status(200)
        .json({ message: 'Perfil actualizado con éxito', user: updatedUser })

  } else {
    return res.status(200).json({
      success: false,
      message: 'La contraseña no cumple con los parametros'
    })
  }
} catch (error) {
      res
        .status(500)
        .json({
          message: 'Error al actualizar el perfil',
          error: error.message
        })
    }
  }
}

module.exports = userController
