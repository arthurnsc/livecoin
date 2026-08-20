let moedasCarteira = [];
const divMoedasAdd = document.getElementById('div-moedas-adicionadas');

const overlaycarteira = document.getElementById('overlay-modal');

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



function atualizarListaMoedas() {
    divMoedasAdd.innerHTML = '';

    moedasCarteira.forEach((moeda, index) => {
        const nomeCapitalizado = moeda.simbolo.charAt(0).toUpperCase() + moeda.simbolo.slice(1);
        divMoedasAdd.innerHTML += `
            <p class="moeda-adicionada" data-index="${index}">
                ${moeda.quantidade} - ${nomeCapitalizado}
                <img class="img-lixeira" src="/static/images/lixeira.png" alt="Remover" data-index="${index}">
            </p>
        `;
    });

    document.querySelectorAll('.img-lixeira').forEach((lixeira) => {
        lixeira.addEventListener('click', () => {
            const posicao = parseInt(lixeira.dataset.index);
            moedasCarteira.splice(posicao, 1);
            atualizarListaMoedas();
        });
    });
}


const addCripto = document.getElementById('btn-adicionar-moeda');
addCripto.addEventListener('click', () => {
    const quantidade = document.getElementById('btn-quantidade').value;
    const criptomoeda = document.getElementById('select-moedas').value;

    if (quantidade) {
        moedasCarteira.push({simbolo: criptomoeda, quantidade: parseFloat(quantidade)});
        atualizarListaMoedas();
        document.getElementById('btn-quantidade').value = '';
        document.getElementById('select-moedas').value = 'bitcoin';
    } else {
        alert('Preencha a quantidade');
    }
});


document.getElementById('btn-salvar').addEventListener('click', adicionarCarteira);

function adicionarCarteira() {

    const nomeCarteira = document.getElementById('nome-carteira').value;

    if (nomeCarteira && moedasCarteira.length >= 1) {

        const novaCarteira = {
            nome: nomeCarteira,
            criptomoedas: moedasCarteira
        };

        fetch('/carteiras', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(novaCarteira)
        })
        .then(resposta => resposta.json())
        .then(dados => {
            console.log(dados);
        })
        .catch(erro => {
            console.error('Erro ao salvar carteira:', erro);
        });
    

        alert('Carteira adicionada');
        moedasCarteira = [];
        atualizarListaMoedas()
        overlaycarteira.style.display = 'none';
        document.getElementById('nome-carteira').value = '';
        document.getElementById('btn-quantidade').value = '';
        document.getElementById('select-moedas').value = 'bitcoin';
    } else {
        alert('Preencha todos os dados');
    };
};