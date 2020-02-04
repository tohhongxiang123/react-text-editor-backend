import { Request, Response } from 'express'
import { verifyToken } from '../use-cases/users'

/**
 * Handles Bearer Authentication
 * If successful, adds 'username' and 'userid' fields to request
 */
async function handleBearerAuth(req : Request, res: Response, next: any) {
    if (!req.headers['authorization']) return res.status(401).json({error: 'Authorization header required'})
    
    const [authType, token] = req.headers['authorization'].split(' ')
    
    if (authType !== 'Bearer') return res.status(401).json({error: 'Bearer authorization required'})

    try {
        const { _id, username } = await verifyToken(token)
        req['username'] = username
        req['userid'] = _id
        next()
    } catch(e) {
        // invalid token
        return res.status(401).json({error: e.message})
    }
    
}

export default handleBearerAuth