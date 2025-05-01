// Button click handlers
document.addEventListener('DOMContentLoaded', () => {
    // Start Game button
    document.getElementById('start-game').addEventListener('click', () => {
        window.location.href = 'pregame.html';
    });

    // Instructions button
    document.getElementById('instructions').addEventListener('click', () => {
        window.location.href = 'instructions.html';
    });
});

