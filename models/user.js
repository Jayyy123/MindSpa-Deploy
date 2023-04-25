/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2022*/
/**
 * user Model
 * @copyright 2022 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */

const moment = require('moment');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { intersection } = require('lodash');
const coreModel = require('./../core/models');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      oauth: DataTypes.STRING,
      role_id: DataTypes.INTEGER,
      first_name: DataTypes.STRING,
      user_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      nick_name: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: true, validate: {} },
      password: DataTypes.STRING,
      type: DataTypes.INTEGER,
      data:DataTypes.STRING,
      verify: DataTypes.INTEGER,
      phone: DataTypes.STRING,
      photo: DataTypes.TEXT,
      refer: DataTypes.STRING,
      // two_factor_authentication: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: 'user',
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, User);

  User._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = User.allowFields();
    allowedFields.push(User._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  User.timeDefaultMapping = function () {
    let results = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j++) {
        let hour = i < 10 ? '0'.i : i;
        let min = j < 10 ? '0'.j : j;
        results[i * 60 + j] = `${hour}:${min}`;
      }
    }
    return results;
  };

  User.associate = function (models) {
    User.belongsTo(models.role, {
      foreignKey: 'role_id',
      as: 'role',
      constraints: false,
    });
    User.hasMany(models.token, {
      foreignKey: 'user_id',
      as: 'tokens',
      constraints: false,
    });
  };


  User._preCreateProcessing = function (data) {

    return data;
  };
  User._postCreateProcessing = function (data) {
    if (data.password && data.password.length < 1) {
      delete data.password;
    }
    if (data.image && data.image.length < 1) {
      delete data.image;
    }
    return data;
  };

  User.role_id_mapping = function (role_id) {
    const mapping = { 1: 'Admin', 2: 'Writer', 3: 'Super Admin' };
    // const mapping = {"1":"Admin","2":"Member","3":"Writer","4":"Super Admin"}

    if (arguments.length === 0) return mapping;
    else return mapping[role_id];
  };

  User.status_mapping = function (status) {
    const mapping = { 0: 'Inactive', 1: 'Active' };

    if (arguments.length === 0) return mapping;
    else return mapping[status];
  };

  User.verify_mapping = function (verify) {
    const mapping = { 0: 'Not verified', 1: 'Verified' };

    if (arguments.length === 0) return mapping;
    else return mapping[verify];
  };

  User.type_mapping = function (type) {
    const mapping = { 0: 'Normal', 1: 'Facebook', 2: 'Google' };

    if (arguments.length === 0) return mapping;
    else return mapping[type];
  };

  User.two_factor_authentication_mapping = function (
    two_factor_authentication
  ) {
    const mapping = { 0: 'No', 1: 'Yes' };

    if (arguments.length === 0) return mapping;
    else return mapping[two_factor_authentication];
  };

  User.allowFields = function () {
    return [
      'user_id',
      'user_id',
      'id',
      'oauth',
      'role_id',
      'first_name',
      'last_name',
      'user_name',
      'email',
      'password',
      'data',
      'type',
      'verify',
      'phone',
      'photo',
      'refer',
      // 'two_factor_authentication',
      'status',
    ];
  };

  User.labels = function () {
    return [
      'ID',
      'Oauth',
      'Role',
      'First Name',
      'Last Name',
      'Email',
      'Password',
      'Type',
      'Verified',
      'Phone Number',
      'Image',
      'Refer Code',
      'Status',
    ];
  };

  User.validationRules = function () {
    return [
      ['id', 'ID', ''],
      ['oauth', 'Oauth', ''],
      ['role_id', 'Role', ''],
      ['first_name', 'First Name', 'required'],
      ['last_name', 'Last Name', 'required'],
      ['user_name', 'User Name', 'required'],
      ['email', 'Email', 'required|valid_email'],
      ['password', 'Password', 'required'],
      ['type', 'Type', 'required'],
      ['verify', 'Verified', 'required'],
      ['phone', 'Phone Number', ''],
      ['photo', 'Image', ''],
      ['refer', 'Refer Code', ''],
      ['status', 'Status', 'required'],
    ];
  };

  User.validationEditRules = function () {
    return [
      ['id', 'ID', ''],
      ['oauth', 'Oauth', ''],
      ['role_id', 'Role', ''],
      ['first_name', 'First Name', 'required'],
      ['last_name', 'Last Name', 'required'],
      ['user_name', 'User Name', 'required'],
      ['email', 'Email', 'required|valid_email'],
      ['password', 'Password', ''],
      ['type', 'Type', 'required'],
      ['verify', 'Verified', 'required'],
      ['phone', 'Phone Number', ''],
      ['photo', 'Image', ''],
      ['refer', 'Refer Code', ''],
      ['status', 'Status', ''],
    ];
  };

  User.get_role_paginated = function (db, where = {}, ...rest) {
    return User.getPaginated(...rest, [
      {
        model: db.role,
        where: where,
        required: Object.keys(where).length > 0 ? true : false,
        as: 'role',
      },
    ]);
  };

  User.get_token_paginated = function (db, where = {}, ...rest) {
    return User.getPaginated(...rest, [
      {
        model: db.token,
        where: where,
        required: Object.keys(where).length > 0 ? true : false,
        as: 'tokens',
      },
    ]);
  };

  User.get_image_paginated = function (db, where = {}, ...rest) {
    return User.getPaginated(...rest, [
      {
        model: db.image,
        where: where,
        required: Object.keys(where).length > 0 ? true : false,
        as: 'images',
      },
    ]);
  };

  User.get_user_role = (id, db) => {
    return User.findByPk(id, {
      include: [
        {
          model: db.role,
          required: false,
          as: 'role',
        },
      ],
    });
  };
  User.get_user_token = (id, db) => {
    return User.findByPk(id, {
      include: [
        {
          model: db.token,
          required: false,
          as: 'tokens',
        },
      ],
    });
  };
  User.get_user_image = (id, db) => {
    return User.findByPk(id, {
      include: [
        {
          model: db.image,
          required: false,
          as: 'images',
        },
      ],
    });
  };

  // ex
  User.intersection = function (fields) {
    if (fields) {
      return intersection(
        [
          'id',
          'oauth',
          'role_id',
          'first_name',
          'last_name',
          'user_name',
          'email',
          'password',
          'type',
          'verify',
          'data',
          'phone',
          'photo',
          'refer',
          'status',
          'created_at',
          'updated_at',
        ],
        Object.keys(fields)
      );
    } else return [];
  };

  return User;
};
