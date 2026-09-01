const secNoticias = document.getElementById('sec-noticias')

function carregarNoticias(){
    fetch('/noticias')
    .then(response => response.json())
    .then(noticias => {
    
        noticias.forEach(noticia => {
            const doc = new DOMParser().parseFromString(noticia.resumo, 'text/html');
            const textoLimpo = doc.body.textContent || "";
            const card = document.createElement('div')
            card.classList.add('card-noticia')
            card.innerHTML = `
                <img class="img-noticia" src="${noticia.imagem}" alt="${noticia.titulo}">
                <h3 class="h3-noticia">${noticia.titulo}</h3>
                <p class="p-noticia">${textoLimpo}</p>
                <a href="${noticia.link}" target="_blank">Leia mais</a>
            `
            secNoticias.appendChild(card)
        })
    })
    .catch(error => {
        console.error('Erro ao carregar notícias:', error)
    })
}
carregarNoticias()