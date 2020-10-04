const { Router } = require('express');
const controllers = require('../controllers/AuthControllers');


const router = Router();


router.post('/signup', controllers.signup);
router.post('/login', controllers.login);
router.get('/logout', controllers.logout);
router.get('/get-new-access-token', controllers.getNewAccessToken);

module.exports = router;