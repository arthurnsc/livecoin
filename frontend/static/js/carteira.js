const overlay = document.getElementById('overlay-modal')

document.getElementById('btn-adicionar').addEventListener('click', () => {
    overlay.style.display = 'flex';
});

document.getElementById('btn-fechar-modal').addEventListener('click', () => {
    overlay.style.display = 'none';
});