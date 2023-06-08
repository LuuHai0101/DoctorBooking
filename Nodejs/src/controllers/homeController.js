//import e from 'express';
import { json } from 'body-parser';
import db from '../models/index';
import CRUDService from '../services/CRUDService'

let getHomePage = async (req, res) =>{
    
    try {
        let data = await db.User.findAll();
        console.log('-----------------------')
        console.log(data)
        console.log('-----------------------')
        
        return res.json(data);
            
    } catch (e) {
        console.log(e)
    }
    
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}

let postCRUD = async (req, res) => {
    let data = req.body;
    console.log("data: ",data)
    await db.User.create({
        email: data.email,
        password: "hashPasswordFromBcrypt",
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phonenumber: data.phonenumber,
        gender: data.gender,
        roleId: data.roleId,
        positionId: data.positionId,
        image: data.avatar
    })
    
    return res.json(data);
}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    return res.render('displayCRUD.ejs', {
        dataTable: data
    })
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    
    if(userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        
        //let userData
        return res.render('editCRUD.ejs', {
            user: userData
        });
        
    }
    else{
        return res.send('helo from edit');
    }
    
}

let putCRUD = async(req, res) => {
    let data = req.body;
    let allUsers = await CRUDService.updateUserData(data);
    return res.render('displayCRUD.ejs', {
        dataTable: allUsers
    })
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id){
        await CRUDService.deleteUserById(id);
        return res.send('delete the user from')

    }
    else{
        return res.send('not')
    }
}
module.exports = {
    getHomePage: getHomePage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD
    
}