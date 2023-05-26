window.addEventListener('load', function(){
    let form = document.querySelector('#form-register');
    form.addEventListener('submit', function(e){
        e.preventDefault();

        let errors = [];
        let name = document.getElementById('name')
        if(name.value == ''){
            errors.push('Este campo debe ser completado obligatoriamente.')
        }

        let email = document.getElementById('email')
        if(email.value == ''){
            errors.push('El mail elegido debe ser válido.')
        }

        let country = document.getElementById('country')
        if(country.value == ''){
            errors.push('Debes elegir tu país de residencia.')
        }

        let password = document.getElementById('password')
        if(password.value.length < 8){
            errors.push('La contraseña debe tener un minimo de 8 caracteres.')
        }

        let categoryA = document.getElementById('admin')
        let categoryB = document.getElementById('user')
        if(!(categoryA.checked || categoryB.checked)){
            errors.push('Debes elegir una categoría')
        }

        if(errors.length > 0){
            let ulErrors = document.querySelector('.errors')
            ulErrors.innerHTML = ""
            e.preventDefault();
            for (let i = 0; i < errors.length; i++) {
                ulErrors.innerHTML += '<li>' + errors[i] + '</li>'
                
            }
        }else{
            form.submit()
        }

    })
})
