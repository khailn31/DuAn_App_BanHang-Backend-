const express=require('express');
const router=express.Router();
router.get("/login",(req,res)=>{
    res.render(  '../view/Login.ejs');
});
router.get("/register",(req,res)=>{
    res.render( '../view/Register.ejs');
});
router.get('/home', (req, res) => {
    res.render('../view/Home.ejs');
  });
  router.get('/AddP', (req, res) => {
    res.render('../view/AddP.ejs');
  });
  router.get('/EditP', (req, res) => {
    res.render('../view/EditP.ejs');
  });
  router.get('/ListP', (req, res) => {
    res.render( '../view/ListP.ejs');
  });
  router.get('/Bills', (req, res) => {
    res.render( '../view/Bill.ejs');
  });
module.exports=router;


