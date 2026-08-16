const overlaycarteira = document.getElementById('overlay-modal')

document.getElementById('btn-adicionar').addEventListener('click', () => {
    overlaycarteira.style.display = 'flex';
});

document.querySelectorAll('.btn-fechar-modal').forEach(button => {
    button.addEventListener('click', () => {
        overlaycarteira.style.display = 'none';
    });
});



const overlaydetalhes = document.getElementById('overlay-modal-detalhes')

document.querySelectorAll('.btn-detalhes').forEach(button => {
    button.addEventListener('click', () => {
        overlaydetalhes.style.display = 'flex';
    });
});

document.querySelectorAll('.btn-fechar-modal').forEach(button => {
    button.addEventListener('click', () => {
        overlaydetalhes.style.display = 'none';
    });
});