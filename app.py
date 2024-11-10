from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/get_activity_data')
def get_activity_data():
    # Example data
    data = {
        "today": {"Category 1": 3, "Category 2": 4, "Category 3": 2},
        "last7days": {
            "2024-11-03": {"Category 1": 2, "Category 2": 3},
            "2024-11-04": {"Category 1": 3, "Category 2": 1},
            "2024-11-05": {"Category 1": 1, "Category 3": 4},
            "2024-11-06": {"Category 2": 3, "Category 3": 2},
            "2024-11-07": {"Category 1": 4, "Category 2": 2, "Category 3": 1}
        }
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)