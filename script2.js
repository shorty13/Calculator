const numberButtons = document.querySelectorAll('.number');
const clearButton = document.getElementById('clear');
const operatorButtons = document.querySelectorAll('.operator');
const display = document.querySelector('.display');
const arrayDisplay = document.getElementById('arrayDisplay');
const equalButton = document.getElementById('equal');
const toggleSigneButton = document.getElementById('neg_pos');
const pointButton = document.getElementById('point');
const percentButton = document.getElementById('percent');

const ValuesAndOperators = [];
var resetDisplay = false;
const error = "ERROR!";




window.onload = function() {
    display.value = "";
};

numberButtons.forEach(function(button) {
    button.addEventListener('click', displayNumbers);
});

operatorButtons.forEach(function(button) {
    button.addEventListener('click', setNumbersToArray);
    button.addEventListener('click', setOperatorToArray);
    button.addEventListener('click', updateArrayDisplay);
});

clearButton.addEventListener('click', clearDisplay);
equalButton.addEventListener('click', calculate);
toggleSigneButton.addEventListener('click', toggleSigne);
pointButton.addEventListener('click', setDezimalPoint);
percentButton.addEventListener('click', calcPercent)


function adjustFontSize() {
    const maxCharacters = 6;  
    let fontSize = 6;
    let currentLength = display.value.length;  
    if (currentLength > maxCharacters) {
        fontSize = 6 - (currentLength - maxCharacters) * 0.4;  
        if (fontSize < 2) fontSize = 2;  
    }
    display.style.fontSize = fontSize + "rem";
}


function displayNumbers() {

    if (display.value === "0" || display.value === "" || resetDisplay) {
        display.value = this.innerText;
        resetDisplay = false;
    } else if (display.value.length < 24 && display.value !== "Max value reached") {
        display.value = display.value + this.innerText;
    } else if (display.value.length === 24) {
        display.value = "Max value reached";
    }
    adjustFontSize();
}

function setNumbersToArray() {

    if (display.value !== '0' && display.value !== '' && ValuesAndOperators.length !== 1) {
        ValuesAndOperators.push(display.value);
        updateArrayDisplay();
    } else if (ValuesAndOperators.length === 1) {
        ValuesAndOperators.length = 0;
        ValuesAndOperators.push(display.value);
    }
}

function setOperatorToArray() {
    
    if (display.value !== '0' && display.value !== '' && ValuesAndOperators.length > 0 
        && ValuesAndOperators[ValuesAndOperators.length - 1] !== '+'
        && ValuesAndOperators[ValuesAndOperators.length - 1] !== '-'
        && ValuesAndOperators[ValuesAndOperators.length - 1] !== '*'
        && ValuesAndOperators[ValuesAndOperators.length - 1] !== '/') {
        ValuesAndOperators.push(this.innerText);
        resetDisplay = true;
        updateArrayDisplay();
    }
}
function updateArrayDisplay() {

    if (arrayDisplay.value.length < 54 && arrayDisplay.value !== "No more space, you can continue calculating ") {
        arrayDisplay.value = ValuesAndOperators.join(' ');
    } else if (arrayDisplay.value.length >= 54) {
        arrayDisplay.value = "No more space, you can continue calculating ";
    }
}

function clearDisplay() {                   
    ValuesAndOperators.length = 0;
    display.value = "";
    arrayDisplay.value = "";
    resetDisplay = false;
    adjustFontSize();
}

function setDezimalPoint() {
    if (display.value.includes('.')) {
    } else if (display.value === '0' || display.value === '') {
        display.value = '0.';
    } else {
        display.value = display.value + '.';
    }
}

function toggleSigne() {
    let currentValue = parseFloat(display.value);
    if (!isNaN(currentValue)) {
        display.value = currentValue * -1;
    }
}

function calculate() {

    if (ValuesAndOperators.length > 1){
        ValuesAndOperators.push(display.value);
        updateArrayDisplay();
    }
    
    while (ValuesAndOperators.indexOf('*') !== -1 || ValuesAndOperators.indexOf('/') !== -1) {
        let multIndex = ValuesAndOperators.indexOf('*');
        let divIndex = ValuesAndOperators.indexOf('/');

        if (multIndex !== -1 && (multIndex < divIndex || divIndex === -1)) {
            let result = parseFloat(ValuesAndOperators[multIndex - 1]) * parseFloat(ValuesAndOperators[multIndex + 1]);
            ValuesAndOperators.splice(multIndex - 1, 3, result);
        } else if (divIndex !== -1 && (multIndex > divIndex || multIndex === -1)) {

            if (parseFloat(ValuesAndOperators[divIndex + 1]) === 0) {
               ValuesAndOperators.length = 0;
               ValuesAndOperators.push(error);
               
            } else {
                let result = parseFloat(ValuesAndOperators[divIndex - 1]) / parseFloat(ValuesAndOperators[divIndex + 1]);
                ValuesAndOperators.splice(divIndex - 1, 3, result);
            }  
        } 
        display.value = ValuesAndOperators[0];
    }

    while (ValuesAndOperators.indexOf('+') !== -1 || ValuesAndOperators.indexOf('-') !== -1) {
        let addIndex = ValuesAndOperators.indexOf('+');
        let subIndex = ValuesAndOperators.indexOf('-');

        if (addIndex !== -1 && (addIndex < subIndex || subIndex === -1)) {
            let result = parseFloat(ValuesAndOperators[addIndex -1]) + parseFloat(ValuesAndOperators[addIndex + 1]);
            ValuesAndOperators.splice(addIndex - 1, 3, result);
        } else if (subIndex !== -1 && (addIndex > subIndex || addIndex === -1)) {
            let result = parseFloat(ValuesAndOperators[subIndex -1]) - parseFloat(ValuesAndOperators[subIndex + 1]);
            ValuesAndOperators.splice(subIndex -1, 3, result);
        }
        display.value = ValuesAndOperators[0];
    }
    adjustFontSize();

    resetDisplay = true;
}

function calcPercent() {
    
    let currentValue = parseFloat(display.value);
    if (ValuesAndOperators.length > 1) {
        let lastOperator = ValuesAndOperators[ValuesAndOperators.length - 1];
        let previousValue = parseFloat(ValuesAndOperators[ValuesAndOperators.length - 2]);

        
        if (lastOperator === '*' || lastOperator === '/') {
            display.value = currentValue / 100;
        } else if (lastOperator === '+' || lastOperator === '-'){
            display.value = ((previousValue / 100) * currentValue);
        }
    } else {
        display.value = currentValue / 100;
    }
}
