const { Router } = require('express');
const controllers = require('../controllers/EducationControllers');

const router = Router();

router.post('/save-cv', controllers.saveEducation);
router.get('/get-cv-list', controllers.getEducation);
router.get('/remove-cv', controllers.removeEducation);

module.exports = router;