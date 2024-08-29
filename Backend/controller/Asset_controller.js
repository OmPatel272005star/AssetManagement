const connection = require('../connection');

const AddAsset=async(req,res)=>{
  const {Code,CategoryId,PurchaseDate,AssetName,isDead,ReasonForDead}=req.body;
try{
  const sqlQuery=`
  INSERT INTO Asset (Code,CategoryId,PurchaseDate,AssetName,isDead,ReasonForDead)
  VALUES (?,?,?,?,?,?);
  `;
  await new Promise((resolve,reject)=>{
    connection.query(sqlQuery,[Code,CategoryId,PurchaseDate,AssetName,isDead,ReasonForDead],
        (err,result)=>{
            if(err){
                reject("error in adding Asset"+err);
            }else{
              resolve("Asset added succesfully ");
            }
        }
    );
  });
  return res.status(200).send(`Asset  added successfully.`);
}catch(err){
    return res.json({message:"error in ty catch block"+err})
}
}

const getAllAsset=async(req,res)=>{
     const sqlQuery=`SELECT * FROM Asset`;
     connection.query(sqlQuery,(err,result)=>{
      if(err){
        throw err;
      }
      return res.json(result);
     });

}
const updateAsset=async(req,res)=>{
    const {id}=req.params;

    const {Code,CategoryId,PurchaseDate,AssetName,isDead,ReasonForDead}=req.body;

    try{
        const sqlQuery=`UPDATE Asset SET Code=?, CategoryId=? , 
        PurchaseDate=? ,AssetName=? , isDead=? ,ReasonForDead=? WHERE AssetId=?`;

        await new Promise((resolve,reject)=>{
            connection.query(sqlQuery,[Code,CategoryId,PurchaseDate,AssetName,isDead,ReasonForDead,id],
                (err,result)=>{
                    if (err) {
                        console.error('Error:', err);
                        reject('Error updating Asset...');
                      } else {
                        resolve(`Asset updated successfully`);
                      }
                }
            )
        })
        return res.status(200).send(`Asset updated successfully.`);
    }catch(err){
        return res.status(500).send('Error updating Asset.' + err);
    }

}

const deleteAsset = async (req, res) => {
    const { id } = req.params;
  
    try {
      const sqlQuery = `DELETE FROM Asset WHERE AssetId = ?`;
      await new Promise((resolve, reject) => {
        connection.query(sqlQuery, [id], (err, result) => {
          if (err) {
            console.error('Error deleting Asset:', err);
            reject('Error deleting Asset...');
          } else {
            if (result.affectedRows === 0) {
              resolve(`No asset found with ID ${id}`);
            } else {
              resolve(`Asset with ID ${id} deleted successfully.`);
            }
          }
        });
      });
  
      return res.status(200).send(`Asset with ID ${id} deleted successfully.`);
    } catch (err) {
      return res.status(500).send('Error deleting Asset.' + err);
    }
  };



module.exports={
    AddAsset,updateAsset,deleteAsset,getAllAsset
}