const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const fileUpload = require("express-fileupload");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("Orders"));
app.use(express.static("services"));
app.use(fileUpload());
////////// connecting with mongo //////////////

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@creativeagencycluster-shard-00-00.lailk.mongodb.net:27017,creativeagencycluster-shard-00-01.lailk.mongodb.net:27017,creativeagencycluster-shard-00-02.lailk.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-yvrwje-shard-0&authSource=admin&retryWrites=true&w=majority`;

//////////// Add to Database /////////////////////

MongoClient.connect(uri, { useUnifiedTopology: true }, function (err, client) {
  const AddToDataBaseCollention = client
    .db(process.env.DB_NAME)
    .collection(process.env.DB_COLLECTION2);

  app.post("/addPartner", (req, res) => {
    const field = req.body;
    AddToDataBaseCollention.insertMany(field).then(result => {
      res.send(result);
      console.log(result.insertedCount);
    });
  });

  app.get("/getPartner", (req, res) => {
    AddToDataBaseCollention.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
});
MongoClient.connect(uri, { useUnifiedTopology: true }, function (err, client) {
  const servicesCollection = client
    .db(process.env.DB_NAME)
    .collection(process.env.DB_COLLECTION3);

  app.post("/addNewService", (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const price = req.body.price;
    const details = req.body.details;
    const newImg = file.data;
    const encImg = newImg.toString("base64");

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, "base64"),
    };

    servicesCollection
      .insertOne({ name, image, price, details })
      .then(result => {
        res.send(result.insertedCount > 0);
        console.log(result.insertedCount);
      });
  });

  app.post("/addServices", (req, res) => {
    const field = req.body;
    servicesCollection.insertMany(field).then(result => {
      res.send(result);
      console.log(result.insertedCount);
    });
  });

  app.get("/getServices", (req, res) => {
    servicesCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
});

MongoClient.connect(uri, { useUnifiedTopology: true }, function (err, client) {
  const slidersCollection = client
    .db(process.env.DB_NAME)
    .collection(process.env.DB_COLLECTION4);

  app.post("/addSliderData", (req, res) => {
    const field = req.body;
    slidersCollection.insertMany(field).then(result => {
      res.send(result);
      console.log(result.insertedCount);
    });
  });

  app.get("/getSliderData", (req, res) => {
    slidersCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
});

MongoClient.connect(uri, { useUnifiedTopology: true }, function (err, client) {
  const reviewsCollection = client
    .db(process.env.DB_NAME)
    .collection(process.env.DB_COLLECTION5);

  app.post("/addReviews", (req, res) => {
    const field = req.body;
    reviewsCollection.insertMany(field).then(result => {
      res.send(result);
      console.log(result.insertedCount);
    });
  });

  app.get("/getReviews", (req, res) => {
    reviewsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/addSingleReview", (req, res) => {
    const NewReview = req.body;
    reviewsCollection.insertOne(NewReview).then(result => {
      res.send(result);
      console.log(result.insertedCount);
    });
  });

  // app.get("/getSingleReview", (req, res) => {
  //   reviewsCollection.find({}).toArray((err, documents) => {
  //     res.send(documents);
  //   });
  // });
});

MongoClient.connect(uri, { useUnifiedTopology: true }, function (err, client) {
  const ordersCollection = client
    .db(process.env.DB_NAME)
    .collection(process.env.DB_COLLECTION1);

  app.post("/addNewOrder", (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const email = req.body.email;
    const price = req.body.price;
    const company_name = req.body.company_name;
    const details = req.body.details;
    const newImg = file.data;
    const encImg = newImg.toString("base64");

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, "base64"),
    };

    ordersCollection
      .insertOne({ name, email, image, price, company_name, details })
      .then(result => {
        res.send(result.insertedCount > 0);
        console.log(result.insertedCount);
      });
  });

  app.get("/getAllOrder", (req, res) => {
    ordersCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/getMyOrder", (req, res) => {
    ordersCollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
});

MongoClient.connect(uri, { useUnifiedTopology: true }, function (err, client) {
  const adminCollection = client
    .db(process.env.DB_NAME)
    .collection(process.env.DB_COLLECTION6);

  app.post("/addAdmin", (req, res) => {
    const userAdmin = req.body;
    adminCollection.insertOne(userAdmin).then(result => {
      res.send(result);
      console.log(result.insertedCount);
    });
  });

  app.get("/getAdmin", (req, res) => {
    adminCollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents.length > 0);
      });
  });
});

////////// connecting with mongo  end //////////////

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(process.env.PORT || 8080, () =>
  console.log("I am listening from 8080")
);

////////////////////////////////////////////
