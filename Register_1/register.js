import users from '../userdata/user.js'

let usersData = null;

window.onload = function(){
    
    if (!localStorage.getItem('users')){
        localStorage.setItem('users',JSON.stringify(users));
    }

    document.querySelector('form').addEventListener('submit',handelRegister)
    usersData = JSON.parse(localStorage.getItem('users'))
    console.log(usersData)
}


function handelRegister(){
    event.preventDefault();
    let formData = new FormData(event.target);
    const user = new User(formData.get('Username').trim(),
                        formData.get('email').trim(),                        
                        formData.get('password').trim());
    
    if(checkUserExists(user.email)){
        document.querySelector('.error').style.display = 'block'
        return;
    }

    if(!checkValidEmail(user.email)){
        document.querySelector('.invalid-email').style.display = 'block'
        return;
    }

    addUserToLocalStorage(user);
    alert('Registeration Sucessful');


}


function addUserToLocalStorage(user){
    usersData.push(user)
    localStorage.setItem('users',JSON.stringify(usersData))
}

function checkUserExists(email){

    for(let i = 0; i < usersData.length; i++){
        if (usersData[i].email === email){
            return true;
        }
    }
    return false;
}

function checkValidEmail(email){
    
    if(!checkValidCharectors(email)){
        return false;
    }

    if(email[0] === '@'){
        return false
    }

    let [name,domain] = getDomainAndName(email);
    
    if(name === ''){
        return false
    }

    if(!noConsecutiveDots(name) || !noConsecutiveDots(domain)){
        return false
    }

    if(!isValidDomain(domain)){
        return false
    }

    return true

    
    function checkValidCharectors(email){
        
        for(let i = 0; i < email.length; i++){
            if((email[i] <= 'z' && email[i] >='a') || (email[i] <= '9' && email[i] >='0') ||
                email[i] === '_' || email[i] === '@' || email[i] === '.'){
                    
                }
                else
                return false
        }
    
        return true
    }
    

    function getDomainAndName(email){
        let data = email.split('@')
        let domain = data[data.length-1];
        data.pop();
        let name = data;

        
        name = name.reduce(function(ac,value){
            return ac+value;
        },"")

        return [name,domain];
    }
    
    //also checks weather domian and name starts with or ends with .
    function noConsecutiveDots(str){
        if(str[0] === '.' || str[str.length-1] === '.')
            return false
        for(let i = 1; i < str.length-1 ; i++){
            if(str[i] === '.' && str[i+1] === '.'){
                return false
            }
        }
        return true
    }

    function isValidDomain(domain){
        var data = domain.split('.')
        
        if(data.length === 1)
            return false;
        

        if(data[data.length-1].length === 1)
            return false;
        
        return true;
    }
}

class User{
    constructor(name,email,password){
        this.name = name;
        this.email = email;
        this.password = password
        this.transactions = [];
    }
    
}
