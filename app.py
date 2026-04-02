from flask import Flask, render_template, request, jsonify
from solver import solve

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/solve", methods=["POST"])
def solve_sudoku():
    data = request.json
    board = data["board"]

    if solve(board):
        return jsonify({"status": "solved", "board": board})
    else:
        return jsonify({"status": "error"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)