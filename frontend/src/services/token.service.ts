const setAccessToken = (token: string): void => {
  localStorage.setItem('access_token', token)
}

const getAccessToken = (): string | null => {
  const dataRaw = localStorage.getItem('access_token')
  if (dataRaw) {
    const data: { timestamp: number; value: string } = JSON.parse(dataRaw)
    if (data.timestamp + 24 * 60 * 60 * 1000 > Date.now()) {
      return data.value
    } else {
      removeAccessToken()
    }
  }
  return null
}

const removeAccessToken = () => {
  localStorage.removeItem('access_token')
}

const setRefreshToken = (token: string): void => {
  localStorage.setItem('refresh_token', token)
}

const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token')
}

const removeRefreshToken = () => {
  localStorage.removeItem('refresh_token')
}

export default {
  setAccessToken,
  getAccessToken,
  removeAccessToken,
  setRefreshToken,
  getRefreshToken,
  removeRefreshToken
}
