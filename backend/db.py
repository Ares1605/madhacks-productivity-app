import mysql.connector
from mysql.connector import Error
from typing import Optional, Any, Tuple
from dotenv import find_dotenv, load_dotenv

load_dotenv()

class DB:
    def __init__(self):
        self.conn = mysql.connector.connection.MySQLConnection(
            host = env.get("DB_HOST"),
            user = env.get("DB_USER"),
            password = env.get("DB_PASS"),
            database = env.get("DB_SCHEMA")
        )
    def insert(self, query: str, args: Tuple = (), lastrowid=True) -> Any:
        """
        Executes a query and returns the result.
        
        Args:
            conn: MySQL connection object
            query: SQL query string
            args: Query parameters as tuple
            
        Returns:
            List of dictionaries for SELECT queries
            Last insert id for INSERT queries
            Number of affected rows for UPDATE/DELETE queries
        """
        cursor = self.conn.cursor(dictionary=True)
        cursor.execute(query, args)
        self.conn.commit()
        if lastrowid:
            result = cursor.lastrowid
        else:
            result = cursor.rowcount
        
        return result

    def read(self, query: str, args: Tuple = ()) -> Any:
        """
        Executes a query and returns the result.
        
        Args:
            conn: MySQL connection object
            query: SQL query string
            args: Query parameters as tuple
            
        Returns:
            List of dictionaries for SELECT queries
            Last insert id for INSERT queries
            Number of affected rows for UPDATE/DELETE queries
        """
        cursor = self.conn.cursor(dictionary=True)
        cursor.execute(query, args)
        
        result = cursor.fetchall()
            
        cursor.close()
        return result
