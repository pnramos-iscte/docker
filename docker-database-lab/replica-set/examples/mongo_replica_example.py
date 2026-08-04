import os
import time

from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError


uri = os.getenv(
    "MONGO_URI",
    "mongodb://mongo1:27017,mongo2:27017,mongo3:27017/?replicaSet=rs0",
)

for attempt in range(1, 31):
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=3000)
        client.admin.command("ping")
        break
    except ServerSelectionTimeoutError:
        if attempt == 30:
            raise
        print("Replica set ainda não está pronto. Nova tentativa em 2 s...")
        time.sleep(2)

collection = client.school_replica.students
result = collection.insert_one(
    {"name": "Bruno Replica", "course": "MongoDB", "active": True}
)
document = collection.find_one({"_id": result.inserted_id})

print("INSERT concluído no primary; o MongoDB replica-o automaticamente.")
print("Documento encontrado com find_one:")
print(document)
print("Primary atual:", client.admin.command("hello").get("primary"))

