const { intersection } = require("lodash");
const coreModel = require("./../core/models");

module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    "token",
    {
      sys_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: DataTypes.TEXT,
      data: DataTypes.TEXT,
      type: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      ttl: DataTypes.INTEGER,
      issue_at: DataTypes.DATE,
      expire_at: DataTypes.DATE,
      status: DataTypes.INTEGER,
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "token",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Token);

  Token._preCreateProcessing = function (data) {
    if (!data.status) data.status = 1;
    return data;
  };
  Token._postCreateProcessing = function (data) {
    return data;
  };
  Token._customCountingConditions = function (data) {
    return data;
  };

  Token._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Token.allowFields();
    allowedFields.push(Token._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Token.timeDefaultMapping = function () {
    let results = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j++) {
        let hour = i < 10 ? "0".i : i;
        let min = j < 10 ? "0".j : j;
        results[i * 60 + j] = `${hour}:${min}`;
      }
    }
    return results;
  };

  Token.status_mapping = function (status) {
    const mapping = { 0: "Inactive", 1: "Active" };

    if (arguments.length === 0) return mapping;
    else return mapping[status];
  };

  Token.type_mapping = function (type) {
    const mapping = { 0: "Forgot token", 1: "Access token", 2: "Refresh token", 3: "Other", 4: "Api Key", 5: "Api Secret", 6: "Verify" };

    if (arguments.length === 0) return mapping;
    else return mapping[type];
  };

  Token.allowFields = function () {
    return ["sys_id", "token", "data", "type", "user_id", "ttl", "issue_at", "expire_at", "status"];
  };

  Token.labels = function () {
    return ["System Id", "Token", "Data", "Token Type", "User", "Time To Live", "Issue at", "Expire at", "Status"];
  };

  Token.validationRules = function () {
    return [
      ["sys_id", "System Id", ""],
      ["token", "Token", "required"],
      ["data", "Data", "required"],
      ["type", "Token Type", "required|integer"],
      ["user_id", "User", "required|integer"],
      ["ttl", "Time To Live", "required|integer"],
      ["issue_at", "Issue at", "required"],
      ["expire_at", "Expire at", "required"],
      ["status", "Status", "required|integer"],
    ];
  };

  Token.validationEditRules = function () {
    return [
      ["sys_id", "System Id", ""],
      ["token", "Token", "required"],
      ["data", "Data", "required"],
      ["type", "Token Type", "required|integer"],
      ["user_id", "User", "required|integer"],
      ["ttl", "Time To Live", "required|integer"],
      ["issue_at", "Issue at", "required"],
      ["expire_at", "Expire at", "required"],
      ["status", "Status", "required|integer"],
    ];
  };

  Token.get_admin_paginated = function (db, where = {}, ...rest) {
    return Token.getPaginated(...rest, [
      {
        model: db.admin,
        where: where,
        required: Object.keys(where).length > 0 ? true : false,
        as: "admin",
      },
    ]);
  };

  Token.get_token_admin = (id, db) => {
    return Token.findByPk(id, {
      include: [
        {
          model: db.admin,
          required: false,
          as: "admin",
        },
      ],
    });
  };

  // ex
  Token.intersection = function (fields) {
    if (fields) {
      return intersection(["sys_id", "token", "data", "type", "user_id", "ttl", "issue_at", "expire_at", "status", "created_at", "updated_at"], Object.keys(fields));
    } else return [];
  };

  return Token;
};
