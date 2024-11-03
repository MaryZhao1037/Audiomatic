from flask import Flask, jsonify
import mysql.connector

app = Flask(__name__)

# Database connection configuration
db_config = {
    'host': '127.0.0.1',       # e.g., 'localhost'
    'user': 'root',   # MySQL username
    'password': 'mysqliscool69!', # MySQL password
    'database': 'hacktx'       # Your database name
}

# Route to fetch all data from the "Prompts" table
@app.route('/api/prompts', methods=['GET'])
def get_prompts():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        
        query = "SELECT * FROM Prompts"
        cursor.execute(query)
        results = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify(results)
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({"error": "Database connection failed"}), 500

# Run the server
if __name__ == '__main__':
    app.run(port=5000, debug=True)
