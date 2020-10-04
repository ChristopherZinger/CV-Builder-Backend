const { Router } = require('express');
const controllers = require('../controllers/ExperienceControllers');


const router = Router();


router.post('/save-experience', controllers.saveExperience);
router.get('/get-experience', controllers.getExperience);
router.get('/remove-experience', controllers.removeExperience);

module.exports = router;