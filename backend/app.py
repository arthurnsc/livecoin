import sqlite3
from flask import Flask

app = Flask(__name__)

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

if __name__ == '__main__':
    criartabelas()