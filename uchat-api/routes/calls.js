const express=require("express");

const router=express.Router();

const auth=require("../middleware/auth");


const {

createCall,
updateCall,
callHistory

}=require("../controllers/callController");



router.post(
"/",
auth,
createCall
);



router.put(
"/:id",
auth,
updateCall
);



router.get(
"/history",
auth,
callHistory
);



module.exports=router;