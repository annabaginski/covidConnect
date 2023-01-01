const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, postsController.getProfile);
router.get("/feed", ensureAuth, postsController.getFeed);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.get("/initial", ensureAuth, postsController.getInitial);
router.get("/checkin", ensureAuth, postsController.getCheckin);
router.get("/contacttracing", ensureAuth, postsController.getContacttracing);
router.get("/resourcePage", postsController.getResourcePage);
router.get("/pastCheckins", postsController.getPastCheckins);

router.post("/checkin", postsController.createCheckin);
router.post("/initial", postsController.createInitial);
router.post("/contacttracing", postsController.createContact);

// Special routes for healthcare workers

router.get("/signupHCW", authController.getSignupHCW);
router.post("/signupHCW", authController.postSignupHCW);
router.get("/profileNurse", ensureAuth, postsController.getProfileNurse);

module.exports = router;
