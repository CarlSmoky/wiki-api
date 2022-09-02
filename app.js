import express from 'express';
import bodyParser from "body-parser";
import mongoose from 'mongoose';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect(`mongodb://localhost:27017/wikiDB`);

const articlesSchema = new mongoose.Schema ({
  title: String,
  content: String
});

const Article = mongoose.model("article", articlesSchema);

app.get("/articles", (req, res) => {
  Article.find({}, (err, allArticles) => {
    if(!err) {
      res.send(allArticles);
    } else {
      res.send(err);
    }
  })
})

app.post("/articles", (req, res) => {
  const title = req.body.title;
  const content = req.body.content;

  const article = new Article ({
    title,
    content
  });
  
  article.save(err => {
    if (!err) {
      res.send("Successfully add a new article")
    } else {
      res.send(err);
    }
  });
})

let port = process.env.PORT;
if (port == null || port == '') {
  port = 3001;
}

app.listen(port, (req, res) => {
  console.log(`I'm listening ${port}`);
})