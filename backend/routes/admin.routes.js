const express = require('express');
const router = express.Router();
const {
    registerAdmin,
    loginAdmin,
    changePassword,
    // Other controller methods...
} = require("../controller/admin.controller");

// Register a staff
router.post("/register", registerAdmin);

// Login an admin
router.post("/login", loginAdmin);

// Change password
router.patch("/change-password", changePassword);

// Export the router - make sure this is a proper export at the end
module.exports = router;