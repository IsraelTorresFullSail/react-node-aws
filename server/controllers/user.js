export const Read = (req, res) => {
  req.user.hashed_password = undefined
  req.user.salt = undefined
  return res.json(req.user)
}
