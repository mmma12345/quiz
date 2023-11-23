// controllers/GameController.js
const { Category, Title, Question } = require('../mysql/db');

function index(req, res) {
    let user;
    if (req.isAuthenticated()) {
        user = req.user.displayName;
    } else if (req.session.user) {
        user = req.session.user;
    }

    // Use Sequelize to fetch data from your database
    Category.findAll({
        attributes: ['id', 'name'],
        include: [
            {
                model: Title,
                attributes: ['id', 'name', 'image'],
                include: {
                    model: Question,
                    attributes: [
                        'id',
                        'question',
                        'correct_answer',
                        'incorrect_answers',
                    ],
                },
                limit: 4,
            },
        ],
    })
        .then((categories) => {
            res.render('layouts/all', { content: '../category.ejs', categories, user });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Error while fetching data.' });
        });
}

async function show(req, res) {
  const currentPage = parseInt(req.query.page) || 1;
  const offset = (currentPage - 1) * 10;
  const id = req.params.id;

  try {
    const categories = await Category.findAll({
      where: { id },
      include: [
        {
          model: Title,
          include: [
            {
              model: Question,
              attributes: [
                'id',
                'question',
                'correct_answer',
                'incorrect_answers',
            ],
            },
          ],
          limit: 10,
          offset,
        },
      ],
    });
    let user;
    if (req.isAuthenticated()) {
        user = req.user.displayName;
    } else if (req.session.user) {
        user = req.session.user;
    }

    res.render('layouts/all', { content: '../category.ejs', categories, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { index, show };
