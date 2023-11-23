// controllers/GameController.js
const { Sequelize } = require('sequelize');
const { Title, Question } = require('../mysql/db');
const { find } = require('../Controllers/helpers/questionhtml');
let finish_qs_id = 100;

async function index(req, res) {
  const titleId = req.params.titleId; 
  console.log(titleId)
  let user;

  if (req.isAuthenticated()) {
    user = req.user.displayName;
  } else if (req.session.user) {
    user = req.session.user;
  }

  let done = false;
  let correct;
  let incorrect;

  if (req.session[`done${titleId}`]) {
    done = true;
    return res.render('game', {
      titleId,
      done,
      correct: req.session[`correct${titleId}`],
      incorrect: req.session[`incorrect${titleId}`],
      user,
    });
  }

  return res.render('game', { titleId, done, correct, incorrect, user });
}

async function getQuestion(req, res) {
  const { questionIndex } = req.body;
  const titleId = req.params.titleId;

  try {
    const questions = await Question.findAll({
      where: {
        title_id: titleId,
        id: {
          [Sequelize.Op.ne]: finish_qs_id,
        },
      },
    });

    let data;
    let count;
    let ofqs;
    let Index;

    if (questionIndex == 0) {
      data = questions.sort(() => Math.random() - 0.5);
      count = questions.length;
      Index = questionIndex;
      finish_qs_id = data[0].id;
      ofqs = parseInt(Index) + 1;
    } else {
      data = questions;
      count = questions.length + 1;
      Index = parseInt(questionIndex) - 1;
      ofqs = parseInt(Index) + 2;
    }

    if (count == questionIndex) {
      finish_qs_id = 100;
      req.session[`done${titleId}`] = 'done';

      return res.json({
        done: 'done',
        correct: req.session[`correct${titleId}`],
        incorrect: req.session[`incorrect${titleId}`],
      });
    }
    console.log(questions)

    const correctAnswer = data[Index].correct_answer;
    const incorrectAnswers = JSON.parse(data[Index].incorrect_answers);
    
    // Ensure correct answer is included
    const options = [correctAnswer, ...(incorrectAnswers ? incorrectAnswers.slice(0, 3) : [])];
    
    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    let question = data[Index].question;
    let question_id = data[Index].id;
    let answer_type = data[Index].answer_type;
    function getColWidth(totalOptions, currentIndex) {
      if (totalOptions === 1) {
        return 12; // Single option should take up the full width
      } else if (totalOptions === 3 && currentIndex === 2) {
        return 12; // Last option in a set of 3 should take up the full width
      } else {
        return 6; // All other cases, including 2 options and 4 options
      }
    }

    let html = `<div class="container">
      <div class="row">
        <div class="progress-container p-0 rounded-top">
          <div class="progress-bar"></div>
        </div>
        <div id="isCorrect" class="shadow-sm rounded-bottom">
          <div id="logo-container" class="d-flex justify-content-center mt-4">
            <p class="border border-secondary-subtle bg-primary text-white fw-medium rounded-pill mb-0 px-2">
              ${ofqs} of ${count}
            </p>
          </div>
          <div class="col-12 mb-5">
            <h4 id="question" class="text-center">
              ${question}
            </h4>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-3 container">
      <div class="row g-4 options-container">
      ${options.map((option, index) => `
      <div class="col-lg-${getColWidth(options.length, index)} col-12">
        ${answer_type === 'text' ? `<div class="form__group field">    <input type="text" value="${option}"  class="form__field text_answer" placeholder="Name" id="text_answer" required />
        <label for="name" class="form__label">Name</label><div class="w-100 d-flex justify-content-end mt-2"><button class="check-answer-btn btn btn-warning px-4 text-black w-100 border-0 rounded-0">OK</button></div></div>` : `<div class="option col-12 py-2 d-flex justify-content-center" id="option-${index + 1}">${option}</div>`}
      </div>
    `).join('')}
      </div>
    </div>`;
    // const results = find(titleId,questionIndex,finish_qs_id,);
    // const html = results.html;
    // console.log(question)
    return res.json({ html, question_id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function checkAnswer(req, res) {
  const { id, userAnswer, titleId } = req.body;

  try {
    const question = await Question.findByPk(id);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const correctAnswer = question.correct_answer;
    const isCorrect = userAnswer === correctAnswer;

    if (isCorrect) {
      req.session[`correct${titleId}`] = (req.session[`correct${titleId}`] || 0) + 1;
    } else {
      req.session[`incorrect${titleId}`] = (req.session[`incorrect${titleId}`] || 0) + 1;
    }

    if (req.session[`correct${titleId}`] === undefined) {
      req.session[`correct${titleId}`] = 0;
    }
    if (req.session[`incorrect${titleId}`] === undefined) {
      req.session[`incorrect${titleId}`] = 0;
    }

    res.json({ isCorrect, correctAnswer });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function playagain(req, res) {
  const titleId = req.params.titleId;
  if (req.session[`done${titleId}`]) {
    delete req.session[`done${titleId}`];
    delete req.session[`correct${titleId}`];
    delete req.session[`incorrect${titleId}`];
    return res.redirect(`/games/${titleId}`);
  }
}

module.exports = { index, checkAnswer, getQuestion, playagain };
