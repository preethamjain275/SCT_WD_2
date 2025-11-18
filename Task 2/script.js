/**
 * JavaScript: OOP Logic for the Calculator
 * Implements the core functionality using a class.
 */
class Calculator {
    constructor(displayElement) {
        this.displayElement = displayElement;
        this.clear();
    }

    // Resets all state variables
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetDisplay = true;
    }

    // Appends a number or decimal point to the current operand
    appendNumber(number) {
        if (this.currentOperand === 'Error') this.clear();
        
        // Handle display reset (after calculation or initial '0')
        if (this.shouldResetDisplay || this.currentOperand === '0') {
            if (number === '.') {
                this.currentOperand = '0.';
            } else {
                this.currentOperand = number.toString();
            }
            this.shouldResetDisplay = false;
        } else {
            // Prevent multiple decimal points
            if (number === '.' && this.currentOperand.includes('.')) return;
            this.currentOperand += number.toString();
        }
    }

    // Sets the operation and prepares for the next number
    chooseOperation(operation) {
        if (this.currentOperand === 'Error') return;

        // If a previous operation exists and we are not resetting, calculate immediately
        if (this.previousOperand !== '' && !this.shouldResetDisplay) {
            this.calculate();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.shouldResetDisplay = true;
    }
    
    // Performs the stored calculation
    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        // Stop if inputs are invalid or no operation is selected
        if (isNaN(prev) || isNaN(current) || !this.operation) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case 'x':
            case '*': // Added '*' for keyboard support
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    computation = 'Error';
                } else {
                    computation = prev / current;
                }
                break;
            default:
                return;
        }
        
        if (computation === 'Error') {
            this.currentOperand = 'Error';
        } else {
            // Fix floating point precision issues (important for calculators)
            this.currentOperand = parseFloat(computation.toFixed(10)).toString();
        }
        
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetDisplay = true;
    }

    // Toggles the sign of the current operand
    toggleSign() {
        if (this.currentOperand === '0' || this.currentOperand === 'Error') return;
        
        if (this.currentOperand.startsWith('-')) {
            this.currentOperand = this.currentOperand.substring(1);
        } else {
            this.currentOperand = '-' + this.currentOperand;
        }
    }

    // Divides the current operand by 100
    getPercent() {
        if (this.currentOperand === 'Error') return;
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        this.currentOperand = (current / 100).toString();
        this.shouldResetDisplay = true;
    }

    // Updates the display element in the DOM
    updateDisplay() {
        this.displayElement.innerText = this.currentOperand;
    }
}

// --- Application Setup and Event Handling ---

// Get the display element
const displayElement = document.getElementById('display');

// Instantiate the Calculator object (OOP)
const calculator = new Calculator(displayElement);

// Get all buttons (number, operator, and utility)
const buttons = document.querySelectorAll('.btn'); 

// 1. Mouse/Touch Click Event Listener Setup
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const number = button.dataset.number;
        const action = button.dataset.action;

        if (number != null) {
            calculator.appendNumber(number);
        } else if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide') {
            // Use button.innerText ('+', '-', 'x', '/') as the operation symbol
            calculator.chooseOperation(button.innerText);
        } else if (action === 'calculate') {
            calculator.calculate();
        } else if (action === 'clear') {
            calculator.clear();
        } else if (action === 'sign') {
            calculator.toggleSign();
        } else if (action === 'percent') {
            calculator.getPercent();
        }
        
        calculator.updateDisplay();
    });
});

// 2. Keyboard Input Handling (NEW REQUIREMENT)
document.addEventListener('keydown', (e) => {
    // Prevent default browser actions for common keys (like 'Enter')
    e.preventDefault(); 
    
    const key = e.key;

    // Handle Numbers and Decimal
    if ((key >= '0' && key <= '9') || key === '.') {
        calculator.appendNumber(key);
    } 
    // Handle Standard Operators (+, -, *, /)
    else if (key === '+' || key === '-' || key === '/') {
        calculator.chooseOperation(key);
    } 
    // Handle Multiplication (using 'x' in UI but '*' key on keyboard)
    else if (key === '*') {
        calculator.chooseOperation('x'); // Map '*' keyboard input to 'x' used internally
    }
    // Handle Equals/Enter
    else if (key === '=' || key === 'Enter') {
        calculator.calculate();
    } 
    // Handle Clear (Escape)
    else if (key === 'Escape') {
        calculator.clear();
    } 
    // Handle Backspace (Clear last digit - optional advanced feature)
    // NOTE: Requires an 'undo' method in the class, currently just skipping.
    
    // Update display after keypress
    calculator.updateDisplay();
});


// Initial display update
calculator.updateDisplay();