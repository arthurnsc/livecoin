import sqlite3
import os
from flask import Flask, request, render_template

basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__,
            template_folder=os.path.join(basedir, '../frontend/templates'),
            static_folder=os.path.join(basedir, '../frontend/static'))


def criartabelas():
    conexao = sqlite3.connect('tabelas.db')
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


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/carteira')
def carteira():
    return render_template('carteira.html')


@app.route('/carteiras', methods=['POST'])
def criar_carteira():
    dados = request.get_json()
    print(dados)  # debug

    nome_carteira = dados['nome']
    lista_criptomoedas = dados['criptomoedas']

    conexao = sqlite3.connect('tabelas.db')
    cursor = conexao.cursor()
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


if __name__ == '__main__':
    criartabelas()
    app.run(debug=True)

