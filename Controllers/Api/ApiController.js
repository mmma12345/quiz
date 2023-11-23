const db = require('../mysql/db');

function category(req, res){
  const currentPage = parseInt(req.query.page) || 1;
  const offset = (currentPage - 1) * 10;
  const id = req.params.id;
  db.query('SELECT id, name AS title_name FROM titles WHERE id = ?',[id], (err, titleRows) => {
    if (err) {
        return res.json('err');
    }

    const datas = [];
    const fetchCategories = (index) => {
        if (index >= titleRows.length) {
          return res.json({datas});
        }

        const title = titleRows[index];
        db.query(
            `SELECT
                categories.id AS category_id,
                categories.name AS category_name,
                COUNT(questions.id) AS question_count
            FROM
                categories
            LEFT JOIN
                questions ON categories.id = questions.category_id
            WHERE
                categories.title_id = ?
            GROUP BY
                categories.id, categories.name
            ORDER BY
                categories.id
            LIMIT 10 OFFSET ?`, [title.id, offset],
            (err, categoryRows) => {
                if (err) {
                    return callback(err);
                }

                title.categories = categoryRows;
                datas.push(title);
                fetchCategories(index + 1);
            }
        );
    };
   
    fetchCategories(0);
});
}

module.exports = { category }