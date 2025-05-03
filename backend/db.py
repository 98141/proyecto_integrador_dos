from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["miapp"]
users_collection = db["usuarios"]
