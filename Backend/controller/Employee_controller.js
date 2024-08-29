const connection = require('../connection');

const addEmployee = async (req, res) => {
    try {
        const { FirstName, LastName, Email, PhoneNo } = req.body;

        const result = await new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO Employee (FirstName, LastName, Email, PhoneNo) VALUES (?, ?, ?, ?)',
                [FirstName, LastName, Email, PhoneNo],
                (err, result) => {
                    if (err) {
                        console.error('Error:', err);
                        reject('Error adding employee....');
                    } else {
                        resolve(result); // Pass the result of the query to the resolve callback
                    }
                }
            );
        });

        // Assuming `result` here holds information about the added employee
        const addedEmployee = {
            id: result.insertId, // Assuming `insertId` holds the ID of the newly inserted employee
            FirstName,
            LastName,
            Email,
            PhoneNo
        };

        res.status(201).json({ message: 'Employee added successfully.', employee: addedEmployee });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error adding employee..');
    }
};


  const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params; // Extract employee ID from URL parameters
        await new Promise((resolve, reject) => {
            connection.query(
                'DELETE FROM Employee WHERE EmployeeId = ?',
                [id], // Use id instead of employeeId
                (err, result) => {
                    if (err) {
                        console.error('Error:', err);
                        reject('Error deleting employee.');
                    } else {
                        resolve(`Employee deleted successfully. ID: ${id}`); // Include the employee ID in the response message
                    }
                }
            );
        });

        res.status(200).send(`Employee deleted successfully. ID: ${id}`); // Include the employee ID in the response message
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error deleting employee.');
    }
};

const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params; // Extract employee ID from URL parameters
        const { FirstName, LastName, Email, PhoneNo } = req.body; // Extract update data from request body

        // Construct the SQL update query
        const sqlQuery = `UPDATE Employee 
                          SET FirstName = ?, LastName = ?, Email = ?, PhoneNo = ?
                          WHERE EmployeeId = ?`;

        // Execute the SQL update query
        await new Promise((resolve, reject) => {
            connection.query(
                sqlQuery,
                [FirstName, LastName, Email, PhoneNo, id], // Provide update data and employee ID as parameters
                (err, result) => {
                    if (err) {
                        console.error('Error:', err);
                        reject('Error updating employee.');
                    } else {
                        resolve(`Employee updated successfully. ID: ${id}`);
                    }
                }
            );
        });

        res.status(200).send(`Employee updated successfully. ID: ${id}`);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error updating employee.');
    }
};

const searchById=async(req,res)=>{
    try{
        const{id}=req.params;
        const sqlQuery=`SELECT * FROM Employee WHERE EmployeeId = ?`
        let result = await new Promise((resolve, reject) => {
            connection.query(sqlQuery, [id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows); // Resolve with the rows fetched from the database
                }
            });
        });

        if(result.length>0){
            const employee={
               EmployeeId: result[0].EmployeeId,
               FirstName:result[0].FirstName,
               LastName:result[0].LastName,
               Email:result[0].Email,
               PhoneNo:result[0].PhoneNo,
            }
           return res.status(200).json({message:`employee with id ${id} found succesfully`,employee});
        }else{
            return res.status(404).json({message:`user with ${id} not found`});
        }
    }catch(err){
        return res.status(500).json({message:"error in serching employee"});
    }
}

const getAllEmployee=async(req,res)=>{
    try{
        const sqlQuery=`SELECT EmployeeId,FirstName,LastName,Email,PhoneNo From Employee`;
        let result=await new Promise((resolve,reject)=>{
            connection.query(sqlQuery,[],
                (err,result)=>{
                    if(err){
                      reject(err);
                    }else{
                      resolve(result);
                    }
                }
            )
        });

        return res.status(200).json(result);

    }catch(err){
        return res.status(500).json({message:"error in getting employee"})
    }
}

const getAdmin=async(req,res)=>{
    try{
    const sqlQuery=`SELECT * FROM Admin`;
    let result=await new Promise((resolve,reject)=>{
        connection.query(sqlQuery,[],
            (err,result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            }
        )
    });

    return res.status(200).json({result});
   
    }catch(err){
        console.log(`error in fetching admion details  ${err}`)
        return err;
    }
}
module.exports={
    addEmployee,deleteEmployee,updateEmployee,searchById,getAllEmployee,getAdmin
}