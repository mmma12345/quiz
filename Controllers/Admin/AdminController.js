const {sequelize, Title, Question, Category} = require('../../mysql/db');
const fs = require('fs').promises;
const path = require('path'); 

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
                attributes: ['id', 'name'],
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
            res.render('layouts/admin', { content: '../admin/index.ejs', categories, user });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Error while fetching data.' });
        });
}


function create(req, res) {
    let user;
    if (req.isAuthenticated()) {
        user = req.user.displayName;
    } else if (req.session.user) {
        user = req.session.user;
    }

    sequelize.query('SELECT * FROM categories', { type: sequelize.QueryTypes.SELECT })
        .then((categories) => {
            return res.render('layouts/admin', { content: '../admin/create.ejs', categories, user });
        })
        .catch((err) => {
            return res.json(err);
        });
}

async function store(req, res) {
    const { category_id, title, questions } = req.body;
    let transaction;
    const categoryId = parseInt(category_id.replace(/\D/g, ''));
    console.log(category_id)
    console.log(categoryId)
    try {
        transaction = await sequelize.transaction();
        // Store data in the 'titles' table
        const titleInstance = await Title.create({
            category_id: categoryId,
            name: title,
            image: req.file.filename,
            created_at: new Date(),
        }, { transaction });
    
        // Store data in the 'questions' table
        const questionInstances = await Promise.all(JSON.parse(questions).map(async (q) => {
            return await Question.create({
                question: q.question,
                correct_answer: q.correct_answer,
                incorrect_answers: q.incorrect_answers,
                answer_type: q.answer_type,
                title_id: titleInstance.id,
            }, { transaction });
        }));
    
        await transaction.commit();
    
        // Redirect or return a response as needed
        res.json({ success: true });
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        console.error(error);
        res.status(500).json({ error: 'Error while storing data.' });
    }
    
}



function edit(req, res) {
    sequelize.query('SELECT * FROM questions WHERE category_id = :category_id AND id != :finish_qs_id', {
        replacements: { category_id: categoryid, finish_qs_id: finish_qs_id },
        type: sequelize.QueryTypes.SELECT,
    })
        .then((datas) => {
            // Process the results
        })
        .catch((err) => {
            return res.json(err);
        });
}

module.exports = { index, edit, create, store };