import cors from "cors";
import mongoose from "mongoose";
import {createUser, socialLogin, editUser, getUser, getUserById, updateScore,  getLeaderboard} from "../puzzleController/userController.js";
import {jwtAuthMiddleware} from "../MiddleWear/jwt.js"
import { createStoreItem, getAllStoreItems } from "../puzzleController/storeController.js";
import { userPurchase } from "../puzzleController/purchaseController.js"
import {initiateFriendsGame, joinGameController,startGame, roundEnd} from "../puzzleController/gameController.js"
// import { createquestion, createQuestionbyself, deletequetion, Editquestion, getQuestions } from "../gamecontrollers/questionController.js";
//  import { createcategory, deletecategory, editCategory, getCategories } from "../gamecontrollers/categoryController.js";
//  import upload from "../MiddleWear/multer.js"; // Adjust path as needed


 

const CustomRoutes = (http, express) => {
   http.get("/wordPole", (req, res) => {
     res.send("word Game App");
   });

  http.use(cors());
  http.use(express.static("dist"));
  http.use(express.urlencoded({ extended: true }));
  http.use(express.json());
  
// user routes 
// http.post("/gameApp/createquestion", upload.single("file"), createquestion);
 http.post("/wordPole/guestLogin", createUser);
 http.post("/wordPole/socialLogin", socialLogin);
 http.post("/wordPole/updateProfile",jwtAuthMiddleware, editUser);
 http.get("/wordPole/getUser",jwtAuthMiddleware, getUser);
 http.get("/wordPole/getUserById/:id", getUserById);
 http.get("/wordPole/getLeaderboard", getLeaderboard);


http.post("/wordPole/updateScore",jwtAuthMiddleware, updateScore);
http.get("/wordPole/leaderboard", getLeaderboard)



getLeaderboard



// // store routes 
http.post("/wordPole/createstoreItem", createStoreItem);
http.get("/wordPole/getAllStoreItems", getAllStoreItems);
http.post("/wordPole/userPurchase",jwtAuthMiddleware, userPurchase);



// purchase routes 
http.post("/wordPole/userPurchase",jwtAuthMiddleware, userPurchase);
startGame
roundEnd
// gameroutes
http.post("/wordPole/initiateFriendsGame",jwtAuthMiddleware, initiateFriendsGame);
http.post("/wordPole/joinGameController", joinGameController);
http.post("/wordPole/startGame", startGame);
http.post("/wordPole/roundEnd", roundEnd);

}



export default CustomRoutes;
