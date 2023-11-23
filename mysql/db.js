const { Sequelize,DataTypes } = require('sequelize');

const sequelize = new Sequelize('quiz_game', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    timestamps: false, 
  },
});

const Title = sequelize.define('titles', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

const Category = sequelize.define('categories', {
  name: DataTypes.STRING,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
});


const Question = sequelize.define('questions', {
  question: DataTypes.STRING,
  correct_answer: DataTypes.STRING,
  incorrect_answers: DataTypes.JSON, 
  answer_type: DataTypes.STRING,
},{
    timestamps: false, // Disable timestamps
  }
);

// Assuming you already have the Category, Title, and Question models defined

Category.hasMany(Title, { foreignKey: 'category_id' });
Title.belongsTo(Category, { foreignKey: 'category_id' });
Title.hasMany(Question, { foreignKey: 'title_id' });
Question.belongsTo(Title, { foreignKey: 'title_id' });


// Synchronize the models with the database
sequelize.sync();
module.exports = { sequelize, Title, Question, Category };
