const db = require('../db');

function find(categoryid, questionIndex, finish_qs_id, res, callback){
  console.log('finishid' + finish_qs_id)
  console.log('qsIndexid' + questionIndex)
  console.log('categoryid' + categoryid)
        if (!questionIndex) {
          console.log("KL")
          questionIndex = 0;
        }

        db.query('SELECT * FROM questions WHERE category_id = ? AND id != ?', [categoryid, finish_qs_id], (err, datas) => {
          if (err || datas === null) {
            console.log('err');
            return callback(err, null);
          }
          let data;
          let count;
          let ofqs;
          let Index;

          if (questionIndex == 0) {
            data = datas.sort(() => Math.random() - 0.5);
            count = datas.length;
            Index = questionIndex;
          } else{
            data = datas;
            count = datas.length + 1;
            Index = parseInt(questionIndex) - 1;
          }

          if (count == questionIndex) {
            return callback(null, {'done': 'done'});
          }
          console.log(count)
          const options = [data[Index].correct_answer, ...JSON.parse(data[Index].incorrect_answers)];
          options.sort(() => Math.random() - 0.5);
      
          let question = data[Index].question;
          let id = data[Index].id;
          let answer1 = options[0];
          let answer2 = options[1];
          let answer3 = options[2];
          let answer4 = options[3];
    
          ofqs = parseInt(questionIndex) + 1;

          let html = `<div class="container">
          <div class="row">
              <div class="progress-container p-0 rounded-top">
                  <div class="progress-bar"></div>
              </div>
              <div id="isCorrect" class="shadow-sm rounded-bottom">
                  <div id="logo-container" class="d-flex justify-content-center mt-4">
                      <p
                          class="border border-secondary-subtle bg-primary text-white fw-medium rounded-pill mb-0 px-2">
                          ` + ofqs + `
                          of
                          `+count+`</p>
                  </div>
  
                  <div class="col-12 mb-5">
                      <h4 id="question" class="text-center">
                          ` + question + `
                      </h4>
                  </div>
              </div>
          </div>
      </div>
      <div class="mt-3 container">
          <div class="row g-4 options-container">
              <div class="col-lg-6 col-12 ps-lg-0">
                  <div class="option col-12 py-2 d-flex justify-content-center"  id="option-1">` + answer1 + `</div>
              </div>
              <div class="col-lg-6 col-12 pe-lg-0">
                  <div class="option col-12 py-2 d-flex justify-content-center" id="option-2">` + answer2 + `</div>
              </div>
              <div class="col-lg-6 col-12 ps-lg-0">
                  <div class="option col-12 py-2 d-flex justify-content-center" id="option-3">` + answer3 + `</div>
              </div>
              <div class="col-lg-6 col-12 pe-lg-0">
                  <div class="option col-12 py-2 d-flex justify-content-center" id="option-4">` + answer4 + `</div>
              </div>
          </div>
      </div>`;

          return callback(null, { id, datas, html });
        });
}

module.exports = { find }