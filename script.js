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

function calcPercent() {
    let currentValue = parseFloat(display.value);
    
    if (isNaN(currentValue)) {
        display.value = error; // Fehler anzeigen, wenn der Wert keine Zahl ist
        return;
    }

    // Prozente in Abhängigkeit vom letzten Operator korrekt berechnen
    if (ValuesAndOperators.length > 0) {
        let lastOperator = ValuesAndOperators[ValuesAndOperators.length - 1];

        if (lastOperator === '*' || lastOperator === '/') {
            // Bei Multiplikation/Division Prozente wie normal verarbeiten
            display.value = currentValue / 100;
        } else if (lastOperator === '+' || lastOperator === '-') {
            // Bei Addition/Subtraktion Prozente relativ zum vorherigen Wert berechnen
            let previousValue = parseFloat(ValuesAndOperators[ValuesAndOperators.length - 2]);
            display.value = (previousValue * currentValue) / 100;
        }
    }
}

function calculate() {
    if (ValuesAndOperators.length > 1) {
        ValuesAndOperators.push(display.value); // Füge den letzten Wert hinzu
        updateArrayDisplay();
    }

    // Schritt 1: Punkt vor Strich (Multiplikation/Division/Prozent)
    for (let i = 0; i < ValuesAndOperators.length; i++) {
        if (ValuesAndOperators[i] === '*' || ValuesAndOperators[i] === '/') {
            let result = 0;
            let valueBefore = parseFloat(ValuesAndOperators[i - 1]);
            let valueAfter = parseFloat(ValuesAndOperators[i + 1]);

            switch (ValuesAndOperators[i]) {
                case '*':
                    result = valueBefore * valueAfter;
                    break;
                case '/':
                    if (valueAfter === 0) {
                        display.value = error;
                        return;
                    }
                    result = valueBefore / valueAfter;
                    break;
                
            }

            ValuesAndOperators.splice(i - 1, 3, result); // Ersetze durch das Ergebnis
            i--; // Index anpassen
        }
    }

    for (let i = 0; i < ValuesAndOperators.length; i++) {
        if(ValuesAndOperators[i] === '%') {
            let result = 0;
            let valueBefore = parseFloat(ValuesAndOperators[i - 1]);
            let valueAfter = parseFloat(ValuesAndOperators[i + 1]);
            result = valueBefore * (valueAfter / 100); 

            ValuesAndOperators.splice(i -1, 3, result);
            i--;
        }
    }
    
    // Schritt 2: Addition und Subtraktion
    for (let i = 0; i < ValuesAndOperators.length; i++) {
        if (ValuesAndOperators[i] === '+' || ValuesAndOperators[i] === '-') {
            let result = 0;
            let valueBefore = parseFloat(ValuesAndOperators[i - 1]);
            let valueAfter = parseFloat(ValuesAndOperators[i + 1]);

            if (ValuesAndOperators[i] === '+') {
                result = valueBefore + valueAfter;
            } else if (ValuesAndOperators[i] === '-') {
                result = valueBefore - valueAfter;
            }

            ValuesAndOperators.splice(i - 1, 3, result); // Ersetze durch das Ergebnis
            i--;
        }
    }

    display.value = ValuesAndOperators[0]; // Zeige das Endergebnis an
    resetDisplay = true;
}