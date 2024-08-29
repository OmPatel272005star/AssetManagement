const connection = require('../connection');

const addAllocation = async (req, res) => {
    const { EmployeeId, AssetId, AssignDate, ReturnDate } = req.body;
    
    const sqlQuery = `
      INSERT INTO Allocation (EmployeeId, AssetId, AssignDate, ReturnDate)
      VALUES (?, ?, ?, ?);
    `;
  
    await new Promise((resolve, reject) => {
      connection.query(sqlQuery, [EmployeeId, AssetId, AssignDate, ReturnDate], (err, result) => {
        if (err) {
          reject('Error adding Allocation: ' + err.message);
        } else {
          resolve();
        }
      });
    })
      .then(() => {
        res.status(200).send('Asset allocated successfully');
      })
      .catch((err) => {
        res.status(500).send('Error allocating asset: ' + err);
      });
}
const getAllAllocation = async (req, res) => {
  const sqlQuery = `SELECT * FROM Allocation`;
  try {
    const result = await new Promise((resolve, reject) => {
      connection.query(sqlQuery, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    return res.json(result);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const updatAllocation = async (req, res) => {
    const allocationId = req.params.id; // Get the allocation ID from the request URL
    const { EmployeeId, AssetId, AssignDate, ReturnDate } = req.body; // Extract updated fields from the request body

    const sqlQuery = `
      UPDATE Allocation 
      SET EmployeeId = ?, AssetId = ?, AssignDate = ?, ReturnDate = ?
      WHERE AllocationId = ?;
    `;

    await new Promise((resolve, reject) => {
        connection.query(sqlQuery, [EmployeeId, AssetId, AssignDate, ReturnDate, allocationId], (err, result) => {
            if (err) {
                reject('Error updating Allocation: ' + err.message);
            } else {
                if (result.affectedRows === 0) {
                    reject('Allocation not found'); // If no rows were affected, reject with 'Allocation not found'
                } else {
                    resolve();
                }
            }
        });
    })
        .then(() => {
            res.status(200).send('Allocation updated successfully');
        })
        .catch((err) => {
            if (err === 'Allocation not found') {
                res.status(404).send(err);
            } else {
                res.status(500).send('Error updating allocation: ' + err);
            }
        });
}


module.exports={
    addAllocation,updatAllocation,getAllAllocation
}