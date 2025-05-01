// Import solution checks
import htmlChecks from './solutionChecks/htmlChecks.js';
import cssChecks from './solutionChecks/cssChecks.js';
import jsChecks from './solutionChecks/jsChecks.js';

// Solution check functions for each case
const solutionChecks = {
    html: htmlChecks,
    css: cssChecks,
    js: jsChecks
};

// Get language from URL parameters
const language = new URLSearchParams(window.location.search).get('language') || 'html';

// Cases data
const cases = {
  "html": [
    {
      "title": "Case 1: Hello World",
      "description": "Write 'Hello World' on the page.",
      "html": "",
      "correctHtml": "<p>Hello World</p>",
      "css": "",
      "js": "",
      "consoleMessage": "HTML Error: Add a paragraph with 'Hello World'"
    },
    {
      "title": "Case 2: Add a Button",
      "description": "Add a button that says 'Click Me'.",
      "html": "",
      "correctHtml": "<button>Click Me</button>",
      "css": "",
      "js": "",
      "consoleMessage": "HTML Error: Add a button element"
    },
    {
      "title": "Case 3: Add a Picture",
      "description": "Add an image of a cat using the exact path 'images/cat.jpg'.",
      "html": "",
      "correctHtml": "<img src=\"images/cat.jpg\">",
      "css": "",
      "js": "",
      "consoleMessage": "HTML Error: Add an image element with src='images/cat.jpg'"
    }
  ],
  "css": [
    {
      "title": "Case 1: Make Text Big",
      "description": "Make the text bigger by setting its font size to 24px.",
      "html": "<div class=\"text-box\">\n  <p class=\"big\">This text needs to be bigger</p>\n</div>",
      "css": "",
      "correctCss": "font-size: 24px;",
      "js": "",
      "consoleMessage": "CSS Error: Add font-size: 24px to make the text bigger"
    },
    {
      "title": "Case 2: Make Text Red",
      "description": "Make the text red by setting its color property.",
      "html": "<div class=\"text-box\">\n  <p class=\"red\">This text needs to be red</p>\n</div>",
      "css": "",
      "correctCss": "color: red;",
      "js": "",
      "consoleMessage": "CSS Error: Add color: red to make the text red"
    },
    {
      "title": "Case 3: Make Text Bold",
      "description": "Make the text bold by setting its font weight.",
      "html": "<div class=\"text-box\">\n  <p class=\"bold\">This text needs to be bold</p>\n</div>",
      "css": "",
      "correctCss": "font-weight: bold;",
      "js": "",
      "consoleMessage": "CSS Error: Add font-weight: bold to make the text bold"
    }
  ],
  "js": [
    {
      "title": "Case 1: Show Alert",
      "description": "Write code to show an alert that says 'Hello!'",
      "html": "<button onclick='showAlert()'>Click Me</button>",
      "js": "",
      "correctJs": "alert('Hello!');",
      "css": "",
      "consoleMessage": "JavaScript Error: Add alert('Hello!');"
    },
    {
      "title": "Case 2: Change Text",
      "description": "Write code to change the text to 'Hello!'",
      "html": "<p id='text'>Change this text</p>",
      "js": "",
      "correctJs": "document.getElementById('text').textContent = 'Hello!';",
      "css": "",
      "consoleMessage": "JavaScript Error: Use getElementById and textContent"
    },
    {
      "title": "Case 3: Add Numbers",
      "description": "Write code to show the sum of 5 + 10",
      "html": "<p id='result'>The answer is: </p>",
      "js": "",
      "correctJs": "document.getElementById('result').textContent = 5 + 10;",
      "css": "",
      "consoleMessage": "JavaScript Error: Add 5 + 10 and show in the paragraph"
    }
  ]
};
  
// Game state variables
let currentFile = 'html';  // Current active file type
let code = {};            // Stores the current code for each file type
let initialCode = {};     // Stores the initial code
let currentCase;          // Case being solved
let currentCaseIndex = 0; // Index of current case
let isCaseSolved = false; // Flag to track if current case is solved

// Cache frequently accessed DOM elements for better performance
const domElements = {
    caseTitle: document.getElementById('case-title'),
    caseDescription: document.getElementById('case-description'),
    consoleMessage: document.querySelector('.console-message'),
    fileTabs: document.getElementById('file-tabs'),
    codeArea: document.getElementById('code-area'),
    actionButtons: document.querySelector('.action-buttons'),
    resultsContent: document.getElementById('results-content')
};

/**
 * Creates a message template for displaying feedback to the user
 * @param {string} type - Type of message (success, error, hint)
 * @param {string} title - Message title
 * @param {string} content - Message content
 * @returns {string} HTML string for the message
 */
function createMessage(type, title, content) {
    return `
        <div class="message ${type}-message">
            <h3>${title}</h3>
            <p>${content}</p>
        </div>
    `;
}

// Handle button clicks
function handleButtonClick(buttonId) {
    switch(buttonId) {
        case 'start-game':
            window.location.href = 'pregame.html';
            break;
        case 'instructions':
            window.location.href = 'instructions.html';
            break;
        default:
            console.warn(`Unknown button ID: ${buttonId}`);
    }
}
  
//Updates the UI with current case information and sets up the code editor and file tabs

function updateUI() {
    try {
        // Update case information
        domElements.caseTitle.textContent = currentCase.title;
        domElements.caseDescription.textContent = currentCase.description;
        domElements.consoleMessage.style.display = 'none';
        
        // Update file tabs
        domElements.fileTabs.innerHTML = `<button class="active">${language.toUpperCase()}</button>`;
        
        // Set current file and update code area
        currentFile = language;
        domElements.codeArea.value = code[language];
        applyChanges();
    } catch (error) {
        handleError(error, 'Error updating UI');
    }
}

//Applies changes from the code editor to the current file
function applyChanges() {
    try {
        code[currentFile] = domElements.codeArea.value;
    } catch (error) {
        handleError(error, 'Error applying changes');
    }
}

/**
 * Checks if the current solution is correct
 * @returns {boolean} True if solution is correct, false otherwise
 */
function checkSolution() {
    const currentCode = domElements.codeArea.value.trim();
    const checks = {
        html: () => currentCode === currentCase.correctHtml,
        css: () => solutionChecks.css[`checkCase${currentCaseIndex + 1}`](currentCode),
        js: () => currentCode === currentCase.correctJs
    };
    return checks[currentFile] ? checks[currentFile]() : false;
}

//Shows or hides the hint for the current case

function showHint() {
    const consoleMessage = domElements.consoleMessage;
    consoleMessage.style.display = consoleMessage.style.display === 'block' ? 'none' : 'block';
    if (consoleMessage.style.display === 'block') {
        consoleMessage.innerHTML = createMessage('hint', 'Hint', currentCase.consoleMessage);
    }
}

//Submits the current solution for checking and provides feedback based on whether the solution is correct
 
function submitFix() {
    try {
        if (isCaseSolved) return;

        const currentCode = domElements.codeArea.value.trim();
        
        if (!currentCode) {
            domElements.resultsContent.innerHTML = createMessage('error', 'Empty Input', 'Please enter your solution before submitting.');
            return;
        }

        if (checkSolution()) {
            isCaseSolved = true;
            const feedback = {
                html: `Great job! You correctly added: ${currentCode}`,
                css: `Excellent! You applied: ${currentCode}`,
                js: `Well done! Your code works: ${currentCode}`
            }[currentFile];
            
            domElements.resultsContent.innerHTML = createMessage('success', '✓ Correct!', `${feedback}<br>Move on to the next case!`);
        } else {
            const feedback = {
                html: 'Check the HTML structure and try again.',
                css: 'Check the CSS property and value.',
                js: 'Check the JavaScript syntax.'
            }[currentFile];
            
            domElements.resultsContent.innerHTML = createMessage('error', 'Try Again', `${feedback}<br>Click hint for help.`);
        }
    } catch (error) {
        handleError(error, 'Error submitting fix');
    }
}

// Helper function to get property descriptions
function getPropertyDescription(property, value) {
  const descriptions = {
    'background-color': `sets the background color to ${value}`,
    'font-size': `makes the text ${value} in size`,
    'text-align': `aligns the text to the ${value}`,
    'color': `sets the text color to ${value}`,
    'font-weight': `makes the text ${value}`,
    'margin': `adds ${value} of space around the element`,
    'border': `adds a ${value} border around the element`,
    'border-radius': `makes the corners round with a radius of ${value}`,
    'display': `${value === 'none' ? 'hides' : 'shows'} the element`,
    'padding': `adds ${value} of space inside the element`
  };
  
  return descriptions[property] || 'applies the specified styling to the element.';
}

//Resets the code to its initial state

function resetCode() {
    try {
        code[currentFile] = initialCode[currentFile];
        domElements.codeArea.value = initialCode[language];
        applyChanges();
    } catch (error) {
        handleError(error, 'Error resetting code');
    }
}

//Initialises the game with the first case
 
function initializeGame() {
    try {
        currentCase = cases[language][currentCaseIndex];
        code = { ...currentCase };
        initialCode = { ...currentCase };
        updateUI();
    } catch (error) {
        handleError(error, 'Error initializing game');
    }
}

/**
 * Navigates between cases
 * @param {string} direction - 'next' or 'prev' to move between cases
 */
function navigateCase(direction) {
    try {
        const newIndex = currentCaseIndex + (direction === 'next' ? 1 : -1);
        if (newIndex >= 0 && newIndex < cases[language].length) {
            currentCaseIndex = newIndex;
            currentCase = cases[language][currentCaseIndex];
            code = { ...currentCase };
            initialCode = { ...currentCase };
            isCaseSolved = false;
            domElements.resultsContent.textContent = '';
            updateUI();
        } else {
            alert(direction === 'next' ? "You've completed all cases!" : "This is the first case!");
        }
    } catch (error) {
        handleError(error, 'Error navigating cases');
    }
}

// Exits the game and returns to the main menu

function exitGame() {
    window.location.href = 'index.html';
}

// Initialise event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Add click handlers for main menu buttons
        const buttons = ['start-game', 'instructions'];
        buttons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', () => handleButtonClick(buttonId));
            }
        });

        // Initialise game-specific functionality on game page
        if (domElements.fileTabs) {
            domElements.fileTabs.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') {
                    currentFile = e.target.textContent.toLowerCase();
                    domElements.codeArea.value = code[currentFile];
                }
            });
            
            domElements.codeArea.addEventListener('input', (e) => {
                code[currentFile] = e.target.value;
            });
            
            document.getElementById('next-case').addEventListener('click', () => navigateCase('next'));
            document.getElementById('prev-case').addEventListener('click', () => navigateCase('prev'));
            document.getElementById('submit-btn').addEventListener('click', submitFix);
            document.getElementById('reset-btn').addEventListener('click', resetCode);
            document.getElementById('hint-btn').addEventListener('click', showHint);
            document.getElementById('exit-btn').addEventListener('click', exitGame);
            
            // Initialise the game
            initializeGame();
        }
    } catch (error) {
        handleError(error, 'Error setting up event listeners');
    }
});

// Error handling
function handleError(error, message) {
    console.error(message, error);
    if (domElements.resultsContent) {
        domElements.resultsContent.innerHTML = createMessage('error', 'Error', message);
    }
}