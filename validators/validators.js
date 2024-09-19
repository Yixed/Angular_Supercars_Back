const User = require ("../models/user.model");

//comprueba si existe un email igual en la DB y lo devuelve si lo hay
const validateEmailBD = async (emailUser) => {
    try {
        const validateEmail = await User.findOne ({email : emailUser});
        return validateEmail;
    } catch (error) {
        console.log(error);
    }
};

//comprueba que la conteraseña cumpla los parametros obligatorios
const validatePassword = (pass) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d$@$!%*?&]{5,12}$/; 
        //^(?=.*[A-Z]):                 min 1 mayuscula
        // (?=.*[a-z]):                 min 1 minuscula
        // (?=.*\d):                    min un numero
        // [A-Za-z\d$@$!%*?&]{4,12}:    [caracteres permitidos], y {min y max}.

    return regex.test(pass) //test devuelve true o false
}

module.exports ={ validateEmailBD, validatePassword };