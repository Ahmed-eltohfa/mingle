import express from 'express';
import { register, login } from '../controllers/authController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/protected', auth, (req, res) => {
    res.json({
        message: 'You are authenticated',
        user: req.user
    });
});

export default router;
