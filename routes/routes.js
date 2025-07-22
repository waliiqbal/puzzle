import cors from "cors";
import mongoose from "mongoose";
import {createUser, socialLogin, editUser, getUser, getUserById} from "../puzzleController/userController.js";
import {jwtAuthMiddleware} from "../MiddleWear/jwt"
import { createStoreItem, getAllStoreItems } from "../puzzleController/storeController.js";
import { userPurchase } from "../puzzleController/purchaseController.js"
// import { createquestion, createQuestionbyself, deletequetion, Editquestion, getQuestions } from "../gamecontrollers/questionController.js";
//  import { createcategory, deletecategory, editCategory, getCategories } from "../gamecontrollers/categoryController.js";
//  import upload from "../MiddleWear/multer.js"; // Adjust path as needed


 

const CustomRoutes = (http, express) => {
   http.get("/wordgame", (req, res) => {
     res.send("word Game App");
   });

  http.use(cors());
  http.use(express.static("dist"));
  http.use(express.urlencoded({ extended: true }));
  http.use(express.json());
  
// user routes 
// http.post("/gameApp/createquestion", upload.single("file"), createquestion);
 http.post("/puzzleApp/createUser", createUser);
 http.post("/puzzleApp/socialLogin", socialLogin);
 http.patch("/puzzleApp/editUser",jwtAuthMiddleware, editUser);
 http.get("/puzzleApp/getUser",jwtAuthMiddleware, getUser);
 http.get("/puzzleApp/getUserById/:id", getUserById);







// // store routes 
http.post("/puzzleApp/createstoreItem", createStoreItem);
http.get("/puzzleApp/getAllStoreItems", getAllStoreItems);
http.post("/puzzleApp/userPurchase",jwtAuthMiddleware, userPurchase);
// http.get("/gameApp/getCategories", getCategories);
// http.delete("/gameApp/deletecategory/:_id", deletecategory);
// http.patch("/gameApp/editCategory", editCategory);

}



export default CustomRoutes;
