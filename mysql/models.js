  
  module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
      question: DataTypes.STRING,
      correct_answer: DataTypes.STRING,
      incorrect_answer: DataTypes.JSON,
    });
  
    return Question;
  };
  
  module.exports = (sequelize, DataTypes) => {
    const Title = sequelize.define('Title', {
      category_id: DataTypes.STRING,
      title: DataTypes.STRING,
    //   image: DataTypes.STRING,
    });
  
    return Title;
  };
  