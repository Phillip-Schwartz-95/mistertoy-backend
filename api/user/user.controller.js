import { userService } from './user.service.js'

export async function getUsers(req, res) {
  try {
    const users = await userService.query()
    res.json(users)
  } catch (err) {
    console.error('Failed to get users', err)
    res.status(500).send({ err: 'Failed to get users' })
  }
}

export async function getUserById(req, res) {
  try {
    const user = await userService.getById(req.params.id)
    res.json(user)
  } catch (err) {
    console.error('Failed to get user', err)
    res.status(500).send({ err: 'Failed to get user' })
  }
}
