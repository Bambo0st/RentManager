const express = require("express")
const router = express.Router();
const protect = require("../middleware/authMiddleware")
const { authUser, registerUser, updateUserProfile, logoutUser, getUserProfile } = require("../controllers/userController");


router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

module.exports = router;