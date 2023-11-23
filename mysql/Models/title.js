module.exports = (sequelize, DataTypes) => {
    const Title = sequelize.define('Title', {
      category: DataTypes.STRING,
      title: DataTypes.STRING,
    //   image: DataTypes.STRING,
    });
  
    return Title;
  };
  