'use strict';
let displayBalance = document.querySelector('.balance');
let displayIncome = document.querySelector('.income');
let displayExpense = document.querySelector('.expense');
let transactionHistory = document.querySelector('tbody');

const history = [];

let balance = +displayBalance.textContent;
let income = +displayIncome.textContent;
let expense = +displayIncome.textContent;

//creates rows in the table populating it with transcation records stores in the history 
function createRow(history){
    transactionHistory.innerHTML = "";
    
    for(let i = history.length-1; i >=  history.length-1-4; i--){
        if(i<0)
        break;
        let row = document.createElement('tr');
        
        row.append(history[i][0]);
        row.append(history[i][1]);
        row.append(history[i][2]);
        row.append(history[i][3]);

        //adds extra classes in order to filter transaction type
        if(history[i][1].textContent === 'debit'){
        row.classList.add('debit')
        }
        else{
        row.classList.add('credit')
        }

        transactionHistory.append(row);
    }

}


window.onload = function(){
    if(!localStorage.getItem('CurrentUser')){
        location.assign('/Register/register.html')
        return;
    }
    renderDom();
    document.querySelector('form').addEventListener('submit',handleTransaction)
    document.querySelector('.view-options').addEventListener('click',showTransactionRecords)
    document.querySelector('.logout').addEventListener('click',handleLogout);
}

function handleLogout(event){
    localStorage.removeItem('CurrentUser');
    location.assign('/Login/login.html')
}

//when page loads displays users data
function renderDom(){
    //gets the current user information from the localstorage
    let user = JSON.parse(localStorage.getItem('CurrentUser'));
    //display user Name
    document.querySelector('.userName').textContent = user.name;
    let storeData = [];
    renderChart(user)
    //renders transaction details
    for(let i = 0; i < user.transactions.length; i++){
        storeData = updateTransaction(user.transactions[i]);
    }

    createRow(storeData);
}

function renderChart(user){
    am4core.ready(function() {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        
        // Create chart instance
        var chart = am4core.create("chart_div", am4charts.PieChart);
        
        // Add data
            chart.data = [];

            for(let i = 0; i < user.transactions.length;i++){
                if(user.transactions[i].type === 'debit')
                chart.data.push(createChartPiece(user.transactions[i]))
            }
        
        // Add and configure Series
           var pieSeries = chart.series.push(new am4charts.PieSeries());
        var colorSet = new am4core.ColorSet();
        colorSet.list = ["hotpink", "blueviolet", "deepmagenta", "darkturquoise", "green"].map(function(color) {
        return new am4core.color(color);
        });
        pieSeries.colors = colorSet;
        pieSeries.dataFields.value = "amount";
        pieSeries.dataFields.category = "title";
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;
        
        // This creates initial animation
        pieSeries.hiddenState.properties.opacity = 1;
        pieSeries.hiddenState.properties.endAngle = -90;
        pieSeries.hiddenState.properties.startAngle = -90;
        
        }); // end am4core.ready()
    
}

function createChartPiece({title,amount}){
    
    return {
        'title':title,
        'amount':amount,
    }
}

//Handles the transaction data you have entered
function handleTransaction(event){
    event.preventDefault();
    var formData = new FormData(event.target);
    var transactionObject = new TransactionObject(formData.get('title'),
                                                    formData.get('amount'),
                                                    formData.get('transaction-type'))
    event.target.reset()
    if(transactionObject.amount <= 0){
        alert('Enter Amount greater than zero')
    }
    if(transactionObject.type === 'debit'){
        if(transactionObject.amount > balance){
            alert('Insufficient Balance');
            return
        }
    }

    storeTransactionData(transactionObject)
    createRow(updateTransaction(transactionObject))
}



function storeTransactionData(transactionObject){
    console.log(transactionObject)
    let currentUser = JSON.parse(localStorage.getItem('CurrentUser'))
    console.log(currentUser)
    let usersData = JSON.parse(localStorage.getItem('users'));
    for(let i = 0; i < usersData.length; i++){
        if(usersData[i].name === currentUser.name){
            usersData[i].transactions.push(transactionObject);
            currentUser.transactions.push(transactionObject);
            localStorage.setItem('CurrentUser',JSON.stringify(currentUser));
            localStorage.setItem('users',JSON.stringify(usersData));
            if(transactionObject.type === 'debit'){
                renderChart(currentUser);
            }
            
            break;
        }
    }

}

//updates balance,expenses and income on the dom
function updateBalance({title,amount,type,timestamp}){
    switch (type){
        case 'credit' : balance += amount;
                        income += amount
                        displayBalance.textContent = balance;
                        displayIncome.textContent = income;
            break;
        case 'debit': if(balance < amount){
                            alert('Insufficient Balance');
                            return;
                        }
                        balance -= amount;
                        expense += amount
                        displayBalance.textContent = balance;
                        displayExpense.textContent = expense;
            break;
    }
}

//updates the transacton history on the dom
function updateTransaction({title,amount,type,timestamp}){
    
    
    let dataCell = new Array(4).fill(null).map(function(){
                    return document.createElement('td')
                })

    dataCell[0].textContent = title; 
    dataCell[1].textContent = type; 
    dataCell[2].innerHTML = '&#8377;' + amount; 
    dataCell[3].textContent = timestamp;
    
    if(type === 'debit'){
        dataCell[2].classList.add('red')
        dataCell[2].innerHTML = '-' + '&#8377;' + amount; 
    }
    else{
        dataCell[2].classList.add('green')
        dataCell[2].innerHTML = '+' + '&#8377;' + amount; 
    }

    history.push(dataCell);
    //adds extra classes in order to filter transaction type
    updateBalance({title,amount,type,timestamp})
    return history;

}

//filter transaction type based on user choice b/w all debit and credit
function showTransactionRecords(){
    let records = transactionHistory.querySelectorAll('tr')
    console.log(records)
    
    records.forEach(function(record){
        switch(event.target.textContent){
            case 'All': record.style.display = "";
            break;
            case 'Debit':if(!record.classList.contains('debit')){
                                record.style.display = "none";
                            }
                        else{
                                record.style.display = "";
                            }
            break;
            case 'Credit':if(!record.classList.contains('credit')){
                                    record.style.display = "none";
                            }
                            else{
                                    record.style.display = "";
                                }
            break;
        }
    })
}


function TransactionObject(discription,amount,type,time=new Date().toLocaleString()){
    this.title = discription;
    this.amount = Number(amount);
    this.type = type;
    this.timestamp = time
}