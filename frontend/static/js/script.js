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



const ws = new WebSocket('wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/solusdt@ticker/xrpusdt@ticker/bnbusdt@ticker/usdtbrl@ticker/adausdt@ticker/uniusdt@ticker/dogeusdt@ticker/pepeusdt@ticker/polusdt@ticker/linkusdt@ticker/avaxusdt@ticker/dotusdt@ticker');
ws.onmessage = (event) => {
    
    const resposta = JSON.parse(event.data);
    const simbolo = resposta.data.s;
    const preco = parseFloat(resposta.data.c);
    const variacao = parseFloat(resposta.data.P);
    
    const criptomoeda = criptomoedas[simbolo]
    const decimal = criptomoeda.decimais
    const nome = criptomoeda.nome
    const icone = criptomoeda.icone
    const moeda = criptomoeda.moeda

    const card = document.getElementById(simbolo)
    card.innerHTML = `
        <img class="img-cripto" src="https://assets.coincap.io/assets/icons/${icone}@2x.png" alt="${nome}">
        <h3 class="h3-cripto">${nome}</h3>
        <section class="sec-dados">
            <p>${preco.toFixed(decimal)}${moeda}</p>
            <p id="var-${simbolo}">${variacao}%</p>
        </section>
    `;

    if (variacao > 0) {
        document.getElementById(`var-${simbolo}`).style.color = "#329239";
    } else if (variacao < 0) {
        document.getElementById(`var-${simbolo}`).style.color = "#e74c3c";
    } else {
        document.getElementById(`var-${simbolo}`).style.color = "#4d4d4d";
    }
}

ws.onerror = (error) => {
    alert('Erro na conexão WebSocket');
}


