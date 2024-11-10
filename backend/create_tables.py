import os
from dotenv import find_dotenv, load_dotenv
import mysql.connector

# Load environment variables from the .env file
load_dotenv()

# Get database credentials from the environment
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# Create a connection to the database
conn = mysql.connector.connect(
    host=DB_HOST,
    user=DB_USER,
    password=DB_PASSWORD,
    database=DB_NAME
)

cursor = conn.cursor()

# SQL query to create the 'users' table
create_users_table_query = """
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL
);
"""

# SQL query to create the 'items' table
create_items_table_query = """
CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration INT NOT NULL,
    description VARCHAR(255),
    category VARCHAR(255)
);
"""

# Execute the queries to create the tables
try:
    cursor.execute(create_users_table_query)
    cursor.execute(create_items_table_query)
    conn.commit()
    print("Tables created successfully.")
except mysql.connector.Error as err:
    print(f"Error: {err}")

# Close the cursor and the connection
cursor.close()
conn.close()
