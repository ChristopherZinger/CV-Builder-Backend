const { Router } = require('express');
const controllers = require('../controllers/UserProfileControllers');


const router = Router();


router.post('/save-profile', controllers.saveProfile);
router.get('/get-profile', controllers.getProfile);

module.exports = router;