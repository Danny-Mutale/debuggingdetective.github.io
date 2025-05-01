// Selection button handler
document.getElementById('languageForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const language = document.querySelector('input[name="language"]:checked').value;
    window.location.href = `game.html?language=${language}`;
});