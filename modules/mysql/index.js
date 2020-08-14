"use strict";

module.exports = (options, imports, register) => {
    const fs        = require("fs");
    const path      = require("path");
    const Sequelize = require("sequelize");

    const env       = options.environment || "development";
    const config    = require('./config/database.json')[env];
    let sequelize;

    if (process.env.DATABASE_URL) {
      sequelize = new Sequelize(process.env.DATABASE_URL,config);
    } else {
      sequelize = new Sequelize(config.database, config.username, config.password, config);
    }
    sequelize
        .authenticate()
        .then(() => {
            console.log('connected to db');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
    let db = {};
    let modelPath = __dirname + '/models';
    fs
      .readdirSync(modelPath)
      .filter((file) =>  {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
      })
      .forEach((file) =>  {
        // let model = sequelize.import(path.join(modelPath, file));
          const model = require(path.join(modelPath, file))(sequelize, Sequelize);
        db[model.name] = model;
      });

    Object.keys(db).forEach(function(modelName) {
      if ("associate" in db[modelName]) {
        db[modelName].associate(db);
      }
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    register(null, {
        models : db
    });
};
