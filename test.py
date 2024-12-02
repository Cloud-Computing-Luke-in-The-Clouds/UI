from appwrite.client import Client
from appwrite.services.account import Account

client = Client()
client.set_endpoint('https://cloud.appwrite.io/v1') # Your API Endpoint
client.set_project('674cfb4d001b2dab01fd') # Your project ID
client.set_session('674d2dcd4eef7a07766c') # The user session to authenticate with

account = Account(client)

result = account.get()
print(result)