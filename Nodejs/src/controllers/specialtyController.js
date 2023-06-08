import specialtyService from '../services/specialtyService';
import db from '../models/index';

let createSpecialty = async (req, res) => {
    try {
        let infor = await specialtyService.createSpecialty(req.body);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllSpecialty = async (req, res) => {
    try {
        let infor = await specialtyService.getAllSpecialty();
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailSpecialtyById = async (req, res) => {
    try {
        let infor = await specialtyService.getDetailSpecialtyById(req.query.id, req.query.location);

        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let deleteSpecialtyById = async (req, res) => {
    try {
        let id = req.query.id;
        let infor = await db.Specialty.destroy({ where: { id: id } });

        return res.status(204).json(
            "Xóa thành công"
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let updateSpecialty = async (req, res) => {
    try {
        let id = req.body.id;
        let data = await db.Specialty.findOne({
            where: { id: id }
        });
        if (data) {
            await db.Specialty.update({
                name: req.body.name,
                image: req.body.imageBase64,
                descriptionHTML: req.body.descriptionHTML,
                descriptionMarkdown: req.body.descriptionMarkdown,
            },
            {
                where: { id: req.body.id }
            });
            res.status(200).json(data)
        }
        else {
            res.status(404).json({
                errCode: -1,
                errMessage: 'Record not found'
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(404).json({
            errCode: -1,
            errMessage: e
        })
    }
}

let getDetailSpecialtyById2 = async (req, res) => {
    try {
        let id = req.query.id;
        let data = await db.Specialty.findOne({
            where: { id: id }
        });
        res.status(200).json(data)
    } catch (e) {
        console.log(e);
        return res.status(404).json({
            errCode: -1,
            errMessage: e
        })
    }
}

module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById,
    deleteSpecialtyById: deleteSpecialtyById,
    updateSpecialty: updateSpecialty,
    getDetailSpecialtyById2: getDetailSpecialtyById2
}