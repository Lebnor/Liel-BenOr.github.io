from flask import Flask
from flask import render_template

app = Flask(__name__)


@app.route('/')
def main():
    return render_template("index.html")


@app.route('/projects/<name>')
def project(name):
    return render_template(f'projects/{name}')


if __name__ == '__main__':
    app.run()
