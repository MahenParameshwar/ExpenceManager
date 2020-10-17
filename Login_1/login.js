import users from '../userdata/user.js'
let usersData = null;

window.onload = function(){
    if (!localStorage.getItem('users')){
        localStorage.setItem('users',JSON.stringify(users));
    }
    usersData = JSON.parse(localStorage.getItem('users'));
    document.querySelector('form').addEventListener('submit',handleLogin)
}

function handleLogin(event){
    event.preventDefault();
    var formData = new FormData(event.target)
    const [email,password] = [formData.get('email'),formData.get('password')];
    if(!checkUserExists(email,password)){
        console.log('User Does not Exists')
        return;
    }

    location.assign('/Dashboard/dashboard.html')
}

function checkUserExists(email,password){
    let emailExists = false;
    let errorMessage = document.querySelector('.error');
    for(let i = 0; i < usersData.length; i++){
        if (usersData[i].email === email && usersData[i].password === password){
            setUserData(usersData[i]);
            return true;
        }
        if(usersData[i].email === email){
            emailExists = true;
        }
    }

    if(!emailExists){
        errorMessage.textContent = 'Account Does Not Exist'
        errorMessage.style.display = 'inline-block'
        return false;
    }
    
    errorMessage.textContent = 'Wrong Password'
    errorMessage.style.display = 'inline-block'
    return false;

    
}

function setUserData(user){
    localStorage.setItem('CurrentUser',JSON.stringify(user));
}