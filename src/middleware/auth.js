import jwt from 'jsonwebtoken'

export const auth = (req, res, next) => {
	const token = req.get('Authorization').slice(7)
	if (!token) {return res.status(401).json({ message: token})}

	try {
		const decoded = jwt.verify(token, 'randomString')
		req.user = decoded.user
		next()
	} catch (e) {
		console.error(e)
		res.status(500).send({ message: 'Invalid Token'})
	}
}