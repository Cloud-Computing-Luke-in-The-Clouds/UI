// src/auth.js
import { account, OAuthProvider } from './appwrite'

export const loginWithGoogle = async () => {
  try {
    await account.createOAuth2Session(OAuthProvider.Google, 'http://brendoncolumbia.net/', 'http://brendoncolumbia.net/fail')
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const logoutUser = async () => {
  try {
    await account.deleteSession('current')
  } catch (error) {
    console.error(error)
  }
}

export const getCurrentSession = async () => {
  try {
    const session = await account.getSession('current')
    return session
  } catch (error) {
    console.error('Session error:', error)
    return null
  }
}

export const getUser = async () => {
  try {
    const user = await account.get()
    return {
      email: user.email,
      name: user.name,
      id: user.$id,
    }
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

