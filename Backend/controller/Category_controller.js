const connection = require('../connection');

function addCategory(req, res) {
    let { prefix, name, isActive, isDeleted, parentCategoryId } = req.body;
    if(!parentCategoryId){
        parentCategoryId=null;
    }
    const query = `
      INSERT INTO Category (Name, ParentCategoryId, Prefix, IsActive, IsDeleted)
      VALUES (?, ?, ?, ?, ?);
    `;
  
    connection.query(query, [name, parentCategoryId, prefix, isActive, isDeleted], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error adding category..'+err });
      }
       else {
        return res.status(200).json({ message: 'Category added successfully' });
      }
    });
}

const getAllCategory=async(req,res)=>{
  const query = 'SELECT * FROM Category';
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
}
const updateCategory = async (req, res) => {
    const categoryId = req.params;
    const { Name, ParentCategoryId, Prefix, IsActive, IsDeleted } = req.body;
  
    try {
      const sqlQuery = `
        UPDATE Category
        SET Name = ?, ParentCategoryId = ?, Prefix = ?, IsActive = ?, IsDeleted = ?
        WHERE CategoryId = ?`;
  
      await new Promise((resolve, reject) => {
        connection.query(
          sqlQuery,
          [Name, ParentCategoryId, Prefix, IsActive, IsDeleted, categoryId],
          (err, result) => {
            if (err) {
              console.error('Error:', err);
              reject('Error updating Category...');
            } else {
              resolve(`Category updated successfully. ID: ${categoryId}`);
            }
          }
        );
      });
  
      return res.status(200).send(`Category updated successfully. ID: ${categoryId}`);
    } catch (err) {
      return res.status(500).send('Error updating category.' + err);
    }
  };

const deleteCategory=async(req,res)=>{
    const {categoryId} = req.params;
    try{
    const sqlQuery=`DELETE FROM Category WHERE CategoryId=?`;

    await new Promise((resolve,reject)=>{
       connection.query(sqlQuery,[categoryId],
        (err,result)=>{
            if (err) {
                console.error('Error:', err);
                reject('Error deleted Category...');
              } else {
                resolve(`Category deleted successfully. ID: ${categoryId}`);
              }
        }
       )
    });

    return res.status(200).send(`Category deleted successfully. ID: ${categoryId}`);
    }catch(err){
        res.status(500).send('Error deleting category.' + err);
    }
}
module.exports={addCategory,updateCategory,deleteCategory,getAllCategory}