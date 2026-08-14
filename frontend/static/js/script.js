const cardBTC = document.getElementById("BTCUSDT");
const cardETH = document.getElementById("ETHUSDT");
const cardSOL = document.getElementById("SOLUSDT");
const cardXRP = document.getElementById("XRPUSDT");
const cardBNB = document.getElementById("BNBUSDT");
const cardADA = document.getElementById("ADAUSDT");
const cardUSDT = document.getElementById("USDTBRL");



const ws = new WebSocket('wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/solusdt@ticker/xrpusdt@ticker/bnbusdt@ticker/usdtbrl@ticker/adausdt@ticker');
ws.onmessage = (event) => {
    const resposta = JSON.parse(event.data);
    console.log(resposta);
    console.log(resposta.data);
    const simbolo = resposta.data.s;
    const preco = parseFloat(resposta.data.c);
    const variacao = parseFloat(resposta.data.P);


    if (simbolo === "BTCUSDT"){
        cardBTC.innerHTML = `
        <img class="img-cripto" src="https://assets.coincap.io/assets/icons/btc@2x.png" alt="Bitcoin">
        <h3 class="h3-cripto">Bitcoin</h3>
        <section class="sec-dados">
            <p>Preço: ${preco.toFixed(2)}$</p>
            <p id="var-btc">Variação: ${variacao}%</p>
        </section>
        `;
        if (variacao > 0) {
            document.getElementById("var-btc").style.color = "#329239";
        } else if (variacao < 0) {
            document.getElementById("var-btc").style.color = "#e74c3c";
        } else {
            document.getElementById("var-btc").style.color = "#4d4d4d";
        }
    } else if (simbolo === "ETHUSDT"){
        cardETH.innerHTML = `
        <img class="img-cripto" src="https://assets.coincap.io/assets/icons/eth@2x.png" alt="Ethereum">
        <h3 class="h3-cripto">Ethereum</h3>
        <section class="sec-dados">
            <p>Preço: ${preco.toFixed(2)}$</p>
            <p id="var-eth">Variação: ${variacao}%</p>
        </section>
        `;
        if (variacao > 0) {
            document.getElementById("var-eth").style.color = "#329239";
        } else if (variacao < 0) {
            document.getElementById("var-eth").style.color = "#e74c3c";
        } else {
            document.getElementById("var-eth").style.color = "#4d4d4d";
        }
    } else if (simbolo === "SOLUSDT"){
        cardSOL.innerHTML = `
        <img class="img-cripto" src="https://assets.coincap.io/assets/icons/sol@2x.png" alt="Solana">
        <h3 class="h3-cripto">Solana</h3>
        <section class="sec-dados">
            <p>Preço: ${preco.toFixed(2)}$</p>
            <p id="var-sol">Variação: ${variacao}%</p>
        </section>
        `;
        if (variacao > 0) {
            document.getElementById("var-sol").style.color = "#329239";
        } else if (variacao < 0) {
            document.getElementById("var-sol").style.color = "#e74c3c";
        } else {
            document.getElementById("var-sol").style.color = "#4d4d4d";
        }
    } else if (simbolo === "XRPUSDT"){
        cardXRP.innerHTML = `
        <img class="img-cripto" src="https://assets.coincap.io/assets/icons/xrp@2x.png" alt="XRP">
        <h3 class="h3-cripto">XRP</h3>
        <section class="sec-dados">
            <p>Preço: ${preco.toFixed(2)}$</p>
            <p id="var-xrp">Variação: ${variacao}%</p>
        </section>
        `;
        if (variacao > 0) {
            document.getElementById("var-xrp").style.color = "#329239";
        } else if (variacao < 0) {
            document.getElementById("var-xrp").style.color = "#e74c3c";
        } else {
            document.getElementById("var-xrp").style.color = "#4d4d4d";
        }
    } else if (simbolo === "BNBUSDT"){
        cardBNB.innerHTML = `
        <img class="img-cripto" src="https://assets.coincap.io/assets/icons/bnb@2x.png" alt="BNB">
        <h3 class="h3-cripto">BNB</h3>
        <section class="sec-dados">
            <p>Preço: ${preco.toFixed(2)}$</p>
            <p id="var-bnb">Variação: ${variacao}%</p>
        </section>
        `;
        if (variacao > 0) {
            document.getElementById("var-bnb").style.color = "#329239";
        } else if (variacao < 0) {
            document.getElementById("var-bnb").style.color = "#e74c3c";
        } else {
            document.getElementById("var-bnb").style.color = "#4d4d4d";
        }
    } else if (simbolo === "ADAUSDT"){
        cardADA.innerHTML = `
        <img class="img-cripto" src="https://assets.coincap.io/assets/icons/ada@2x.png" alt="Cardano">
        <h3 class="h3-cripto">Cardano</h3>
        <section class="sec-dados">
            <p>Preço: ${preco.toFixed(2)}$</p>
            <p id="var-ada">Variação: ${variacao}%</p>
        </section>
        `;
        if (variacao > 0) {
            document.getElementById("var-ada").style.color = "#329239";
        } else if (variacao < 0) {
            document.getElementById("var-ada").style.color = "#e74c3c";
        } else {
            document.getElementById("var-ada").style.color = "#4d4d4d";
        }
    } else if (simbolo === "USDTBRL"){
        cardUSDT.innerHTML = `
        <img class="img-cripto" src="https://assets.coincap.io/assets/icons/usdt@2x.png" alt="USDT">
        <h3 class="h3-cripto">USDT</h3>
        <section class="sec-dados">
            <p>Preço: ${preco.toFixed(2)}R$</p>
            <p id="var-usdt">Variação: ${variacao}%</p>
        </section>
        `;
        if (variacao > 0) {
            document.getElementById("var-usdt").style.color = "#329239";
        } else if (variacao < 0) {
            document.getElementById("var-usdt").style.color = "#e74c3c";
        } else {
            document.getElementById("var-usdt").style.color = "#4d4d4d";
        }
    }
}

ws.onerror = (error) => {
    alert('Erro na conexão WebSocket');
}
