"use strict";

/** @type Egg.EggPlugin */
exports.cors = {
  enable: true,
  package: "egg-cors",
};

exports.sequelize = {
  enable: true,
  package: "egg-sequelize",
};

exports.static = true;

exports.reactssr = {
  enable: true,
  package: "egg-view-react-ssr",
};

exports.validate = {
  enable: true,
  package: "egg-validate",
};
