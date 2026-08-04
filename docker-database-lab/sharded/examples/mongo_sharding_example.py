import os
import time
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError


uri = os.getenv("MONGO_URI", "mongodb://mongos:27017")

for attempt in range(1, 31):
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=3000)
        client.admin.command("ping")
        break
    except ServerSelectionTimeoutError:
        if attempt == 30:
            raise
        print("Cluster com sharding ainda não está pronto. Nova tentativa em 2 s...")
        time.sleep(2)

database = client.school_sharded

fixed_examples = (
    (database.collection_one, "Coleção 1: documento guardado no shard 1"),
    (database.collection_two, "Coleção 2: documento guardado no shard 2"),
)

for collection, message in fixed_examples:
    result = collection.insert_one({"shard_key": int(time.time_ns()), "message": message})
    document = collection.find_one({"_id": result.inserted_id}, {"_id": 0})
    print(f"{collection.name}: {document}")

third_collection = database.collection_three
for campus in ("norte", "sul"):
    result = third_collection.insert_one({
        "campus": campus,
        "shard_key": int(time.time_ns()),
        "message": f"Documento do campus {campus}",
    })
    document = third_collection.find_one({"_id": result.inserted_id}, {"_id": 0})
    print(f"collection_three ({campus}): {document}")

print("\nNa collection_three: campus=norte vai para o shard 1; campus=sul vai para o shard 2.")
