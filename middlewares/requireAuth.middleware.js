import { authService } from '../api/auth/auth.service.js'

export function requireAuth(req, res, next) {
  if (!req.cookies?.loginToken) return res.status(401).send('Not Authenticated')
  const user = authService.validateToken(req.cookies.loginToken)
  if (!user) return res.status(401).send('Invalid Token')
  req.loggedinUser = user
  next()
}

export function requireAdmin(req, res, next) {
  if (!req.cookies?.loginToken) return res.status(401).send('Not Authenticated')
  const user = authService.validateToken(req.cookies.loginToken)
  if (!user?.isAdmin) return res.status(403).send('Not Authorized')
  req.loggedinUser = user
  next()
}
