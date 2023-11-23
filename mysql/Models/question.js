module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
      question: DataTypes.STRING,
      correct_answer: DataTypes.STRING,
      incorrect_answer: DataTypes.JSON,
    });
  
    return Question;
  };
  