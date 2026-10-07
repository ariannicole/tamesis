const display = document.getElementById("display");
const expressionDisplay = document.getElementById("expression");
const buttonsContainer = document.getElementById("calculator-buttons");

let currentValue = "0";
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;
let currentExpression = "";

function updateDisplay() {
  display.textContent = currentValue;
  expressionDisplay.textContent = currentExpression;
  display.classList.toggle("small", currentValue.length > 12);
}

function inputDigit(digit) {
  if (currentValue === "Error") {
    clearAll();
  }
  if (waitingForSecondOperand) {
    currentValue = digit;
    waitingForSecondOperand = false;
  } else if (currentValue === "0") {
    currentValue = digit;
  } else if (currentValue.replace(/[^0-9]/g, "").length < 12) {
    currentValue += digit;
  }
  updateDisplay();
}

function inputDecimal() {
  if (currentValue === "Error") {
    clearAll();
  }
  if (waitingForSecondOperand) {
    currentValue = "0.";
    waitingForSecondOperand = false;
  } else if (!currentValue.includes(".")) {
    currentValue += ".";
  }
  updateDisplay();
}

function clearAll() {
  currentValue = "0";
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
  currentExpression = "";
  updateDisplay();
}

function deleteLast() {
  if (waitingForSecondOperand || currentValue === "Error") {
    return;
  }
  currentValue = currentValue.slice(0, -1);
  if (currentValue === "" || currentValue === "-") {
    currentValue = "0";
  }
  updateDisplay();
}

function calculate(a, b, op) {
  switch (op) {
    case "+":
      return a + b;
    case "−":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b === 0 ? "Error" : a / b;
    default:
      return b;
  }
}

function formatNumber(num) {
  if (typeof num === "string") {
    return num;
  }
  if (!isFinite(num)) {
    return "Error";
  }
  const rounded = parseFloat(num.toPrecision(12));
  if (rounded !== 0 && (Math.abs(rounded) >= 1e12 || Math.abs(rounded) < 1e-9)) {
    return rounded.toExponential(6);
  }
  return String(rounded);
}

function handleOperator(nextOperator) {
  if (currentValue === "Error") {
    return;
  }
  const inputValue = parseFloat(currentValue);

  if (operator && waitingForSecondOperand) {
    operator = nextOperator;
    currentExpression = `${formatNumber(firstOperand)} ${operator}`;
    updateDisplay();
    return;
  }

  if (firstOperand === null) {
    firstOperand = inputValue;
  } else if (operator) {
    const result = calculate(firstOperand, inputValue, operator);
    if (result === "Error") {
      currentValue = "Error";
      firstOperand = null;
      operator = null;
      waitingForSecondOperand = true;
      currentExpression = "";
      updateDisplay();
      return;
    }
    currentValue = formatNumber(result);
    firstOperand = result;
  }

  operator = nextOperator;
  waitingForSecondOperand = true;
  currentExpression = `${formatNumber(firstOperand)} ${operator}`;
  updateDisplay();
}

function equals() {
  if (operator === null || firstOperand === null || currentValue === "Error") {
    return;
  }
  const inputValue = parseFloat(currentValue);
  const result = calculate(firstOperand, inputValue, operator);
  currentExpression = `${formatNumber(firstOperand)} ${operator} ${formatNumber(inputValue)} =`;
  currentValue = result === "Error" ? "Error" : formatNumber(result);
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = true;
  updateDisplay();
}

buttonsContainer.addEventListener("click", (event) => {
  const button = event.target.closest(".btn");
  if (!button) {
    return;
  }
  const action = button.dataset.action;
  const value = button.dataset.value;

  switch (action) {
    case "digit":
      inputDigit(value);
      break;
    case "decimal":
      inputDecimal();
      break;
    case "operator":
      handleOperator(value);
      break;
    case "equals":
      equals();
      break;
    case "clear":
      clearAll();
      break;
    case "delete":
      deleteLast();
      break;
  }
  button.blur();
});

document.addEventListener("keydown", (event) => {
  if (event.key >= "0" && event.key <= "9") {
    inputDigit(event.key);
  } else if (event.key === ".") {
    inputDecimal();
  } else if (event.key === "+") {
    handleOperator("+");
  } else if (event.key === "-") {
    handleOperator("−");
  } else if (event.key === "*") {
    handleOperator("×");
  } else if (event.key === "/") {
    event.preventDefault();
    handleOperator("÷");
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    equals();
  } else if (event.key === "Escape") {
    clearAll();
  } else if (event.key === "Backspace") {
    deleteLast();
  }
});

updateDisplay();
