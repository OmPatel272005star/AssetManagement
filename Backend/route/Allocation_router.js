const express=require('express');
const Allocation_router=express.Router();

const {addAllocation,updatAllocation, getAllAllocation}=require('../controller/Allocation_controller');

Allocation_router.post('/addallocation',addAllocation);
Allocation_router.put('/updateallocation/:id',updatAllocation);
Allocation_router.get('/getallocation',getAllAllocation);

module.exports=Allocation_router;
