//This function picks up when a language is selected and directs to the game page

document.getElementById('languageForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const language = document.querySelector('input[name="language"]:checked').value;
    window.location.href = `game.html?language=${language}`;
});
