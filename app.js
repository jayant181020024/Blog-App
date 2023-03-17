//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const array=require("lodash");
const { truncate } = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

const mongoose=require("mongoose");
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

main().catch(err => console.log(err));

let Post;
async function main() {

  mongoose.set("strictQuery", false);
  await mongoose.connect('mongodb://127.0.0.1:27017/BlogDb',{useNewUrlParser:true});

  const postSchema=new mongoose.Schema({
    title:String,
    content:String

  });

  Post=new mongoose.model("Post",postSchema);

}

function check(posts,title)
{
  for(var i=0;i<posts.length;i++)
  {
    let postTitle=posts[i].postTitle;
    postTitle=array.lowerCase(postTitle);
    if(postTitle===title)
    {
      return i;
    }
  }
  return -1;
}

app.get("/", function (req, res) {

  Post.find({},function(err,posts){
    if(!err)
    {
      res.render("home", { data: homeStartingContent,postContent :posts});


    }
  })
  
});


app.get("/about", function (req, res) {
  res.render("about", { aboutStartingContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactStartingContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose"); 
});

app.get("/posts/:postId",function(req,res){

  const postId=req.params.postId;

  Post.findById(postId,function(err,doc){
    if(!err)
    {
      res.render("post",{title:doc.title, content :doc.content});
    }
    else
    {
      res.render("post",{title:"Error",content:"Post not found"});
    }
  });
  
  
  
 
});

app.post("/compose",function(req,res){

  const post=new Post({
    title:req.body.titleContent,
    content:req.body.postContent

  });
  post.save();

  res.redirect("/");
  
});














app.listen(3000, function () {
  console.log("Server started on port 3000");
});
