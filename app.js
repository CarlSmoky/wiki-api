import express from 'express';
import bodyParser from "body-parser";
import mongoose from 'mongoose';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect(`mongodb://localhost:27017/wikiDB`);

const articlesSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("article", articlesSchema);

app.route('/articles')
  .get((req, res) => {
    Article.find({}, (err, allArticles) => {
      if (!err) {
        res.send(allArticles);
      } else {
        res.send(err);
      }
    })
  })

  .post((req, res) => {
    const title = req.body.title;
    const content = req.body.content;

    const article = new Article({
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

  .delete((req, res) => {
    Article.deleteMany(err => {
      if (!err) {
        res.send("Successfully delete all articles");
      } else {
        res.send(err);
      }
    });
  })

app.route('/articles/:title')
  .get((req, res) => {
    const title = req.params.title;
    Article.findOne({title}, (err, result) => {
      if(!err) {
        res.send(result)
      } else {
        res.send(err);
      }
    });
  })

  .put((req, res) => {
    Article.updateOne(
      {title: req.params.title},
      {title: req.body.title, content: req.body.content},
      (err) => {
        if(!err) {
          res.send("Succesfully updated")
        } else {
          res.send(err);
        }
      });
  })

  .patch((req, res) => {
    Article.updateOne(
      {title: req.params.title},
      {$set: req.body},
      (err) => {
        if(!err) {
          res.send("Succesfully updated")
        } else {
          res.send(err);
        }
      }
    )
  })

let port = process.env.PORT;
if (port == null || port == '') {
  port = 3001;
}

app.listen(port, (req, res) => {
  console.log(`I'm listening ${port}`);
})