import cors from "cors";
import {createUser, socialLogin, editUser, getUser, getUserById} from "../puzzleController/userController";
import {jwtAuthMiddleware} from "../MiddleWear/jwt"
// import { createquestion, createQuestionbyself, deletequetion, Editquestion, getQuestions } from "../gamecontrollers/questionController.js";

//  import { createcategory, deletecategory, editCategory, getCategories } from "../gamecontrollers/categoryController.js";
//  import upload from "../MiddleWear/multer.js"; // Adjust path as needed


 

const CustomRoutes = (http, express) => {
   http.get("/puzzleApp", (req, res) => {
     res.send("puzzle app");
   });

  http.use(cors());
  http.use(express.static("dist"));
  http.use(express.urlencoded({ extended: true }));
  http.use(express.json());
  
// question routes 
// http.post("/gameApp/createquestion", upload.single("file"), createquestion);
 http.post("/puzzleApp/createUser", createUser);
 http.post("/puzzleApp/socialLogin", socialLogin);
 http.patch("/puzzleApp/editUser",jwtAuthMiddleware, editUser);
 http.get("/puzzleApp/getUser",jwtAuthMiddleware, getUser);
 http.get("/puzzleApp/getUserById/:id", getUserById);

// http.get("/gameApp/getQuestions", getQuestions);
// http.delete("/gameApp/deletequetion/:_id", deletequetion);
// http.patch("/gameApp/Editquestion", Editquestion);






// // category routes 
// http.post("/gameApp/createcategory", createcategory);
// http.get("/gameApp/getCategories", getCategories);
// http.delete("/gameApp/deletecategory/:_id", deletecategory);
// http.patch("/gameApp/editCategory", editCategory);

}



export default CustomRoutes;
