import sqlite3
import os, feedparser
from flask import Flask, request, render_template, jsonify

basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__,
            template_folder=os.path.join(basedir, '../frontend/templates'),
            static_folder=os.path.join(basedir, '../frontend/static'))

DB_PATH = os.path.join(basedir, 'tabelas.db')

def criartabelas():
    conexao = sqlite3.connect(DB_PATH)
    cursor = conexao.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS carteiras (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS moedascarteira(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        carteira_id INTEGER,
        simbolo TEXT,
        quantidade REAL,
        FOREIGN KEY (carteira_id) REFERENCES carteiras(id)
    )
    """)
    conexao.commit()
    conexao.close()
criartabelas()


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/carteira')
def carteira():
    return render_template('carteira.html')


@app.route('/carteiras', methods=['GET', 'POST'])
def criar_carteira():
    if request.method == 'POST':
        dados = request.get_json()

        nome_carteira = dados['nome']
        lista_criptomoedas = dados['criptomoedas']

        conexao = sqlite3.connect(DB_PATH)
        cursor = conexao.cursor()

        cursor.execute("SELECT COUNT(*) FROM carteiras")
        total = cursor.fetchone()[0]
        if total >=5:
            conexao.close()
            return {'mensagem': 'Limite de carteiras atingido'}, 400
        
        cursor.execute("""
        INSERT INTO carteiras (nome) VALUES (?) 
        """, (nome_carteira,))

        carteira_id = cursor.lastrowid
        for criptomoeda in lista_criptomoedas:
            simbolo = criptomoeda['simbolo']
            quantidade = criptomoeda['quantidade']

            cursor.execute("""
            INSERT INTO moedascarteira (carteira_id, simbolo, quantidade) VALUES (?, ?, ?)
            """, (carteira_id, simbolo, quantidade))

        conexao.commit()
        conexao.close()
        return {'mensagem': 'Carteira criada'}, 201
    
    else:
        conexao = sqlite3.connect(DB_PATH)
        cursor = conexao.cursor()
        cursor.execute("""SELECT * FROM carteiras""")
        carteiras = cursor.fetchall()

        lista_final = []
        for carteira in carteiras:
            carteira_id = carteira[0]
            nome = carteira[1]

            cursor.execute("""SELECT * FROM moedascarteira WHERE carteira_id = ? """, (carteira_id,))
            moedas = cursor.fetchall()

            lista_criptomoedas_formatada = []
            for moeda in moedas:
                dicionario_moeda = {"simbolo": moeda[2], "quantidade": moeda[3]}
                lista_criptomoedas_formatada.append(dicionario_moeda)

            dicionario_carteira = {"id": carteira_id, "nome": nome, "moedas": lista_criptomoedas_formatada}
            lista_final.append(dicionario_carteira)

        conexao.close()
        return lista_final

@app.route('/carteiras/<int:id>', methods=['DELETE'])
def deletar_carteira(id):
    conexao = sqlite3.connect(DB_PATH)
    cursor = conexao.cursor()
    cursor.execute("DELETE FROM moedascarteira WHERE carteira_id = ?", (id,))
    cursor.execute("DELETE FROM carteiras WHERE id = ?", (id,))
    conexao.commit()
    conexao.close()
    return {'mensagem': 'Carteira apagada'}, 200

@app.route('/carteiras/<int:id>/moedas', methods=['POST'])
def adicionar_moeda(id):
    dados = request.get_json()
    simbolo = dados['simbolo']
    quantidade = dados['quantidade']

    conexao = sqlite3.connect(DB_PATH)
    cursor = conexao.cursor()

    cursor.execute("""
    INSERT INTO moedascarteira (carteira_id, simbolo, quantidade) VALUES (?, ?, ?)
    """, (id, simbolo, quantidade))

    conexao.commit()
    conexao.close()

    return {'mensagem': 'Moeda adicionada'}, 201


@app.route('/noticias')
def buscarNoticias():
    feed = feedparser.parse("https://cointelegraph.com/rss")
    noticias = []

    for noticia in feed.entries:
        if noticia.get('category') == "Markets" or noticia.get('category') == "Latest News":

            media = noticia.get('media_content', [{}])
            if media:
                imagem = media[0].get('url') 
            else:
                imagem = None

            noticias.append({
                "titulo": noticia.get("title", ""),
                "link": noticia.get("link", "#"),
                "data": noticia.get("published", ""),
                "resumo": noticia.get("summary", ""),
                "imagem": imagem
            })

    return jsonify(noticias)
    
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)

    