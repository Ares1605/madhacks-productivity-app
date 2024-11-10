from datetime import datetime, timedelta

class YourClass:
    def __init__(self):
        self.db = DB()  # Initialize the DB instance

    def inputEvent(self, date_from, duration, description):
        query = "INSERT INTO users (date_from, duration, description) VALUES (%s, %s, %s);"

        args = (date_from, duration, description)

        last_insert_id = self.db.insert(query, args)

        print(f"New event inserted with ID: {last_insert_id}")

    def queryData(self, time: int, category: str):
        query = """
        SELECT SUM(duration) as total_duration
        FROM users
        WHERE category = %s
          AND date_from >= CURDATE() - INTERVAL %s DAY;
        """
        
        args = (category, time)
        result = self.db.read(query, args)

        if result and 'total_duration' in result[0]:
            total_duration = result[0]['total_duration']
            print(f"Total duration for category '{category}' in the last {time} days: {total_duration}")
        else:
            print(f"No records found for category '{category}' in the last {time} days.")

your_class_instance = YourClass()

your_class_instance.inputEvent('2024-11-08', 120, "Meeting about project")

your_class_instance.queryData(5, "productivity")