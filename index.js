const express = require("express");

const { open } = require("sqlite");

const path = require("path");

const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "Inventorycollection.db");

const app = express();

app.use(express.json());

const db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at localhost 3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

db.POST("/products", async (request, response) => {
  const { payload } = request.body;
  for (let item of payload) {
    const { productId, quantity, operation } = item;
    let query;
    if (operation === "add") {
      query = `UPDATE inventory SET quantity = quantity + 1 WHERE productId = ${productId};`;
    } else if (operation === "subtract") {
      query = `UPDATE inventory SET quantity = quantity - 1 WHERE productId = ${productId} and quantity > 0;`;
    }

    const runDb = await db.run(query);
  }

  response.send("Successfully Updated");
});
