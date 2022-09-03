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
  //Promise
  .get(async (req, res) => {
    try {
      const allArticles = await Article.find({});
      res.send(allArticles);
    }
    catch (err) {
      res.send(err);
    }
  })
  //Old way
  // .get((req, res) => {
  //   Article.find({}, (err, allArticles) => {
  //     if (!err) {
  //       res.send(allArticles);
  //     } else {
  //       res.send(err);
  //     }
  //   })
  // })

  //Promise
  .post(async (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const article = new Article({
      title,
      content
    });
    try {
      article.save();
      res.send("Successfully add a new article");
    }
    catch (err) {
      res.send(err);
    }
  })

  //Old way
  // .post((req, res) => {
  //   const title = req.body.title;
  //   const content = req.body.content;

  //   const article = new Article({
  //     title,
  //     content
  //   });

  //   article.save(err => {
  //     if (!err) {
  //       res.send("Successfully add a new article")
  //     } else {
  //       res.send(err);
  //     }
  //   });
  // })
  // Promise
  .delete(async (req, res) => {
    try {
      await Article.deleteMany();
      res.send("Successfully delete all articles");
    }
    catch (err) {
      res.send(err);
    }
  })
// Old way
// .delete((req, res) => {
//   Article.deleteMany(err => {
//     if (!err) {
//       res.send("Successfully delete all articles");
//     } else {
//       res.send(err);
//     }
//   });
// })

app.route('/articles/:title')
  //Using Promise
  .get(async (req, res) => {
    const title = req.params.title;
    try {
      const articleByTitle = await Article.findOne({ title });
      res.send(articleByTitle)
    }
    catch (err) {
      res.send(err);
    }
  })

  // .get((req, res) => {
  //   const title = req.params.title;
  //   Article.findOne({ title }, (err, result) => {
  //     if (!err) {
  //       res.send(result)
  //     } else {
  //       res.send(err);
  //     }
  //   });
  // })

  //Using Promises
  .put(async (req, res) => {
    try {
      const update = await Article.updateOne(
        { title: req.params.title },
        { title: req.body.title, content: req.body.content }
      );
      res.json("Successfully Updated");
    } catch (err) {
      res.json({ message: err });
    }
  })

  // .put( (req, res) =>   {
  // Article.updateOne(
  //   { title: req.params.title },
  //   { title: req.body.title, content: req.body.content },
  //   (err) => {
  //     if (!err) {
  //       res.send("Succesfully updated")
  //     } else {
  //       res.send(err);
  //     }
  //   });
  // }

  // Promise
  .patch(async (req, res) => {
    try {
      await Article.updateOne(
        { title: req.params.title },
        { $set: req.body });
      res.send("Succesfully updated")
    }
    catch (err) {
      res.send(err);
    }
  })
  // Old way
  // .patch((req, res) => {
  //   Article.updateOne(
  //     { title: req.params.title },
  //     { $set: req.body },
  //     (err) => {
  //       if (!err) {
  //         res.send("Succesfully updated")
  //       } else {
  //         res.send(err);
  //       }
  //     }
  //   )
  // })

  //Using promise then , catch
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.title })
      .then(() => {
        res.send("Data deleted"); // Success
      })
      .catch((err) => {
        res.send(err); // Failure
      });
  })

let port = process.env.PORT;
if (port == null || port == '') {
  port = 3001;
}

app.listen(port, (req, res) => {
  console.log(`I'm listening ${port}`);
})