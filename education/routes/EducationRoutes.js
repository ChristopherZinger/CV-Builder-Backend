const { Router } = require('express');
const controllers = require('../controllers/EducationControllers');


const router = Router();


router.post('/save-education', controllers.saveEducation);
router.get('/get-education', controllers.getEducation);
router.get('/remove-education', controllers.removeEducation);

module.exports = router;