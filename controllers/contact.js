const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");
const contact = require("../models/contact");

exports.contact = (req, res) => {
    
    const cont = new contact(req.body);
    cont.save((error, data) => {
      if (error) {
        return res.status(400).json({
          error: errorHandler(error),
        });
      }
      res.json(data);
    });
  };
