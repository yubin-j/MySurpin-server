'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SurpinList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.SurpinList.hasMany(models.SavedUser,{
        foreignKey: 'listId'
      });
      models.SurpinList.hasMany(models.SurpinUrls,{
        foreignKey: 'listId'
      });
      models.SurpinList.hasMany(models.SurpinList_Tags,{
        foreignKey: 'listId'
      });
      models.SurpinList.belongsTo(models.User,{
        foreignKey: 'userId'
      });
    }
  };
  SurpinList.init({
    title: DataTypes.STRING,
    desc: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    thumbnail: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SurpinList',
  });
  return SurpinList;
};