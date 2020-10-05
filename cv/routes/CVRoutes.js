const { Router } = require('express');
const controllers = require('../controllers/CVControllers');

const router = Router();

router.post('/save-cv', controllers.saveCV);
router.get('/get-cv-list', controllers.getCVList);
router.get('/remove-cv', controllers.removeCV);

module.exports = router;