let moedasCarteira = [];
let todasCarteiras = [];
let precosAtuais = {};

const divMoedasAdd = document.getElementById('div-moedas-adicionadas');
const overlaycarteira = document.getElementById('overlay-modal');
const overlaydetalhes = document.getElementById('overlay-modal-detalhes')
const seccarteira = document.getElementById('carteiras')

const ws = new WebSocket('wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/solusdt@ticker/xrpusdt@ticker/bnbusdt@ticker/usdtbrl@ticker/adausdt@ticker/uniusdt@ticker/dogeusdt@ticker/pepeusdt@ticker/polusdt@ticker/linkusdt@ticker/avaxusdt@ticker/dotusdt@ticker');
const criptomoedas = {
    "BTCUSDT": { nome: "Bitcoin", icone: "btc", decimais: 2, moeda: '$'},
    "ETHUSDT": { nome: "Ethereum", icone: "eth", decimais: 2, moeda: '$'},
    "SOLUSDT": { nome: "Solana", icone: "sol", decimais: 2, moeda: '$'},
    "XRPUSDT": { nome: "XRP", icone: "xrp", decimais: 2, moeda: '$'}, 
    "BNBUSDT": { nome: "BNB", icone: "bnb", decimais: 2, moeda: '$'},
    "ADAUSDT": { nome: "Cardano", icone: "ada", decimais: 3, moeda: '$'},
    "USDTBRL": { nome: "USDT", icone: "usdt", decimais: 2, moeda: 'R$'},
    "UNIUSDT": { nome: "Uniswap", icone: "uni", decimais: 5, moeda: '$'},
    "DOGEUSDT": { nome: "Dogecoin", icone: "doge", decimais: 5, moeda: '$'},
    "PEPEUSDT": { nome: "Pepe", icone: "pepe", decimais: 8, moeda: '$'},
    "POLUSDT": { nome: "Polygon", icone: "pol", decimais: 5, moeda:'$'},
    "LINKUSDT": { nome: "Chainlink", icone: "link", decimais: 5, moeda: '$'},
    "AVAXUSDT": { nome: "Avalanche", icone: "avax", decimais: 5, moeda: '$'},
    "DOTUSDT": { nome: "Polkadot", icone: "dot", decimais: 5, moeda: '$'}
};

ws.onmessage = (event) => {
    const resposta = JSON.parse(event.data);
    const simbolo = resposta.data.s;
    const preco = parseFloat(resposta.data.c);
    precosAtuais[simbolo] = preco;
};

function carregarCarteiras() {
    seccarteira.innerHTML = '';
    fetch('/carteiras')
    .then(resposta => resposta.json())
    .then(carteiras => {
        todasCarteiras = carteiras
        carteiras.forEach(carteira => {
            seccarteira.innerHTML += `
            <article class="carteira">
                <div class="info-carteira">
                    <h4 class="h4-carteira">${carteira.nome}</h4>
                    <p class="p-carteira">Valor total: x</p>
                </div>
                <div class="acoes-carteira">
                    <button class="btn-detalhes" data-id="${carteira.id}">Ver detalhes</button>
                    <button class="btn-apagar" data-id="${carteira.id}">Apagar</button>
                </div>
            </article>
            `;
        });

        const divInformacoes = document.getElementById('informacoes-carteira')
        document.querySelectorAll('.btn-detalhes').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.dataset.id;
                const carteiraEncontrada = todasCarteiras.find((carteira) => carteira.id == id)
                console.log(carteiraEncontrada); //debug
                divInformacoes.innerHTML = ''
                overlaydetalhes.style.display = 'flex';
                divInformacoes.innerHTML += `
                    <h2 id="nome-carteira">${carteiraEncontrada.nome}</h2>
                    <div id="detalhes-moedas"></div>
                `
                const divDetalhesMoedas = document.getElementById('detalhes-moedas');
                carteiraEncontrada.moedas.forEach((moeda) => {
                    const info = criptomoedas[moeda.simbolo];
                    const precoAtual = precosAtuais[moeda.simbolo] || 0;
                    const valorTotal = (precoAtual * moeda.quantidade).toFixed(info.decimais);
                    divDetalhesMoedas.innerHTML += `<p>${moeda.quantidade} - ${info.nome} - ${info.moeda}${valorTotal}</p>`;
                });
            });
        });

        document.querySelectorAll('.btn-apagar').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.dataset.id;
                fetch(`/carteiras/${id}`, {method: 'DELETE'})
                .then(() => {
                    carregarCarteiras();
                });
            });
        });
    })
    .catch(erro => {
        console.error('Erro', erro);
    });
}
carregarCarteiras()

document.getElementById('btn-adicionar').addEventListener('click', () => {
    moedasCarteira = [];
    atualizarListaMoedas();
    overlaycarteira.style.display = 'flex';
});

document.querySelectorAll('.btn-fechar-modal').forEach(button => {
    button.addEventListener('click', () => {
        overlaycarteira.style.display = 'none';
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
        document.getElementById('select-moedas').value = 'BTCUSDT';
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
            carregarCarteiras()
        })
        .catch(erro => {
            console.error('Erro ao salvar carteira:', erro);
        });
    
        moedasCarteira = [];
        overlaycarteira.style.display = 'none';
        document.getElementById('nome-carteira').value = '';
        document.getElementById('btn-quantidade').value = '';
        document.getElementById('select-moedas').value = 'bitcoin';
    } else {
        alert('Preencha todos os dados');
    };
};