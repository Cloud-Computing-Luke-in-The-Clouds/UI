import { Client, Account, OAuthProvider } from 'appwrite'
const client = new Client()
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('674cfb4d001b2dab01fd');
export const account = new Account(client);
export { OAuthProvider }