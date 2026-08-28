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


@app.route('/carteiras', methods=['GET', 'POST'])
def criar_carteira():
    if request.method == 'POST':
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
    
    else:
        conexao = sqlite3.connect('tabelas.db')
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
    conexao = sqlite3.connect('tabelas.db')
    cursor = conexao.cursor()
    cursor.execute("DELETE FROM moedascarteira WHERE carteira_id = ?", (id,))
    cursor.execute("DELETE FROM carteiras WHERE id = ?", (id,))
    conexao.commit()
    conexao.close()
    return {'mensagem': 'Carteira apagada'}, 200

if __name__ == '__main__':
    criartabelas()
    app.run(debug=True)

