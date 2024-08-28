const express = require('express');
const { getSlidesBySection, addSlide, updateSlide, deleteSlide } = require('../Controller/homeController');
const { adminAuth } = require('../Middleware/adminAuth');
const router = express.Router();

router.get("/:section",getSlidesBySection);

router.post("/",adminAuth,addSlide);
router.put("/:id",adminAuth,updateSlide);
router.delete("/:id",adminAuth,deleteSlide);


module.exports = router;