// mysql/queries.js
const db = require('./db');

// function getQuizQuestion(categoryid,callback) {
//     db.query(
//         'SELECT * FROM questions WHERE category_id = ? ORDER BY RAND() LIMIT 1',
//         [categoryid], // Pass both parameters in the correct order
//         (err, datas) => {
//           if (err) return callback(err, null);
//           callback(null, datas[0]);
//         }
//     );
// }

// function checkAnswer(id, userAnswer, callback) {
//   db.query('SELECT * FROM questions WHERE id = ?', [id], (err, results) => {
//     if (err) {
//       console.error(err);
//       return callback(err, null);
//     }

//     const correctAnswer = results[0].correct_answer;
//     console.log(correctAnswer + "<br>" + userAnswer);
//     const isCorrect = userAnswer === correctAnswer;

//     // Pass the result to the callback
//     callback(null, { isCorrect, correctAnswer });
//   });
// }

// module.exports = { getQuizQuestion, checkAnswer };
