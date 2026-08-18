const express=require("express");

const router=express.Router();

const auth=require("../middleware/auth");


const {

createNotification,
getNotifications,
markRead

}=require("../controllers/notificationController");



router.post(
"/",
auth,
createNotification
);



router.get(
"/",
auth,
getNotifications
);



router.put(
"/read/:id",
auth,
markRead
);



module.exports=router;