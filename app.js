//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const { name } = require("ejs");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err => console.log(err));
async function main() {
mongoose.connect("mongodb+srv://hilariousheisenberg:skylerwhite@cluster0.mq31mxi.mongodb.net/todolistDB");

const itemsSchema =new mongoose.Schema({
  task : String
});

const Item = mongoose.model("Item",itemsSchema);

const item1 =new Item({
  task:"wake up at 6"
});
const item2 =new Item({
  task:"brush"
});
const item3 =new Item({
  task:"work out"
});

// task1.save();
// task2.save();
// task3.save();

// const defaultItems = [];
const defaultItems = [item1,item2,item3];


const listShema = {
  name : String,
  items : [itemsSchema]
}

const List = mongoose.model("List",listShema);
// Item.deleteMany({name:"brush"});
// await Item.insertMany(defaultItems);
// const items =  await Item.find({});



const itemsCheck =  await Item.find();


if (itemsCheck.length === 0) {

await Item.insertMany(defaultItems);

  
}

// const items =  await Item.find();



// items.forEach(i => {
//   console.log(i.task);
// });
// // console.log(items[0].name);




const day=date.getDate();;

app.get("/", async function(req, res) {

 

const items = await Item.find();

res.render("list", {listTitle: day, newListItems: items});

});

console.log(day);
app.post("/", async function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const newItemName = new Item({
    task:itemName
  });
  

  if (listName === day) {
    newItemName.save();
    res.redirect("/");
  }
  else{
    const obj = await List.findOne({name:listName});
    obj.items.push(newItemName);
    obj.save();
    res.redirect("/lists/"+listName);
  
  }
});

app.post("/delete",async (req,res)=>{
  // console.log(req.body.checkbox);
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName===day) {
    await Item.deleteOne({_id:checkedItemId});
    res.redirect("/");
  }
  else{
    await List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}});
    res.redirect("/lists/"+listName);
  }

  

})

app.get("/lists/:customListName",async(req,res)=>{
  // console.log(req.params.customListName);
  const customListName = _.capitalize(req.params.customListName);

  const obj = await List.findOne({name:customListName})
  if (obj) {
    console.log(obj.name);
           console.log("list already exists "+customListName);
          //  res.render("list",{listTitle:obj.name, newListItems:obj.items})
           res.render("list",{listTitle:customListName, newListItems:obj.items})

    }   
  
  else  {
  const list = new List({
    name: customListName,
    items: defaultItems
  });
  list.save();
  res.redirect("/lists/"+customListName);

  // console.log("list created");

  }
});



// app.get("/list/:paramName",async(req,res)=>{
//   const name = req.params.paramName;
//   const str1="db";
//   let namedb= name+str1;
//   namedb =new mongoose.model("namedb",itemsSchema);

//  const str="item"; 
//  const nameItem=name+str;
//  const array = await namedb.find();
//  res.render("list",{listTitle:name+" list",newListItems:array});
 


// });

// app.post("/list/:paramName",async (req,res)=>{
//   const name = req.params.paramName;
//   const str="item"; 
//   const nameItem=name+str;
//   nameItem = req.body.newItem;
//   const str1="db";
//   let namedb= name+str1;
//   namedb =new mongoose.model("namedb",itemsSchema);
//   const newItemName = new namedb({
//     task:nameItem
//   });
//   newItemName.save();
//   res.redirect("/list/:name");
// });


app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});


// mongoose.connection.close();
}


const PORT = process.env.PORT || 3000 ;

app.listen(PORT, function() {
  console.log("Server started on port "+PORT);
});
