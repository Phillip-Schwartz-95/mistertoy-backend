import { authService } from './auth.service.js'

export async function login(req, res) {
  const { username, password } = req.body
  try {
    const user = await authService.login(username, password)
    const loginToken = authService.getLoginToken(user)
    res.cookie('loginToken', loginToken, { httpOnly: true })
    res.json(user)
  } catch (err) {
    res.status(401).send({ err: 'Failed to login' })
  }
}

export async function signup(req, res) {
  try {
    const { username, password, fullname } = req.body
    const user = await authService.signup(username, password, fullname)
    const loginToken = authService.getLoginToken(user)
    res.cookie('loginToken', loginToken, { httpOnly: true })
    res.json(user)
  } catch (err) {
    res.status(500).send({ err: 'Failed to signup' })
  }
}

export async function logout(req, res) {
  res.clearCookie('loginToken')
  res.send({ msg: 'Logged out successfully' })
}
