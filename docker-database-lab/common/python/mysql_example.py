import os
import time

import pymysql


def connect_with_retry(attempts: int = 30):
    for attempt in range(1, attempts + 1):
        try:
            return pymysql.connect(
                host=os.getenv("MYSQL_HOST", "mysql"),
                port=int(os.getenv("MYSQL_PORT", "3306")),
                user=os.getenv("MYSQL_USER", "student"),
                password=os.getenv("MYSQL_PASSWORD", "studentpass"),
                database=os.getenv("MYSQL_DATABASE", "school"),
                charset="utf8mb4",
                cursorclass=pymysql.cursors.DictCursor,
            )
        except pymysql.MySQLError as error:
            if attempt == attempts:
                raise
            print(f"MySQL ainda não está pronto ({error}). Nova tentativa em 2 s...")
            time.sleep(2)


with connect_with_retry() as connection:
    with connection.cursor() as cursor:
        cursor.execute(
            "INSERT INTO students (name, course) VALUES (%s, %s)",
            ("Ana Docker", "Bases de Dados"),
        )
        inserted_id = cursor.lastrowid
        connection.commit()

        cursor.execute(
            "SELECT id, name, course, created_at FROM students WHERE id = %s",
            (inserted_id,),
        )
        student = cursor.fetchone()

print("INSERT concluído. Registo lido com SELECT:")
print(student)

