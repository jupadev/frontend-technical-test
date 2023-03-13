const path = require("path");
const db = require(`${path.dirname(__filename)}/../db.json`);

// Need this middleware to catch some requests
// and return both conversations where userId is sender or recipient
/** type() */
module.exports = (req, res, next) => {
  console.log("URL", req.url);
  if (req.url.startsWith("/conversation?") && req.method === "GET") {
    console.log("asdasdasdsdsa");
    const convId = req.query?.id;
    const result = db?.conversations?.find((conv) => conv.id == convId);
    console.log("server", result);
    res.status(200).json(result);
    return;
  }
  if (/conversations/.test(req.url) && req.method === "GET") {
    const userId = req.query?.senderId;
    const result = db?.conversations?.filter(
      (conv) => conv.senderId == userId || conv.recipientId == userId
    );

    res.status(200).json(result);
    return;
  }
  next();
};
