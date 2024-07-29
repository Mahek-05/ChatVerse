const express = require("express");
const { accessChat, 
    fetchChats, 
    createGroupChat, 
    renameGroup, 
    removeFromGroup,
    addToGroup 
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");


const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group-chat").post(protect, createGroupChat);
router.route("/rename-group").put(protect, renameGroup);
router.route("/remove-from-group").put(protect, removeFromGroup);
router.route("/add-to-group").put(protect, addToGroup);

module.exports = router;