
const {ctrlWrapper} = require("../middelwares")
const {Contact} = require("../models/contact");




const getAllContacts = async (req, res, next) => {
   
      const result = await Contact.find();
      res.json(result);
    } 

  const getContactById = async (req, res, next) => {
    
      const { id } = req.params;
      const result = await Contact.findById(id);
      if (!result) {
        res.status(404).json({ message: "Not found" });
      }
      res.json(result);
   
  }

  const addContact = async (req, res, next) => {
    
      
      const result = await Contact.create(req.body);
      res.status(201).json(result);
    } 

  const deleteContactById = async (req, res, next) => {
    
      const { id } = req.params;
      const result = await Contact.findByIdAndRemove(id);
      if (!result) {
        res.status(404).json({ message: "Not found" });
      }
      res.json({
        message: "Delete success",
      });
    } 

  const updateContactById = async (req, res, next) => {
    
     
      const { id } = req.params;
      const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
      if (!result) {
        res.status(400).json({ message: "Not found" });
      }
      res.json(result);
    } 

    const updateFavorite = async (req, res, next) => {
    
     
      const { id } = req.params;
      const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
      if (!result) {
        res.status(404).json({ message: "Not found" });
      }
      res.json(result);
    } 

  module.exports = {
    getAllContacts:ctrlWrapper(getAllContacts),
    getContactById:ctrlWrapper(getContactById),
    addContact:ctrlWrapper(addContact),
    deleteContactById:ctrlWrapper(deleteContactById),
    updateContactById:ctrlWrapper(updateContactById),
    updateFavorite:ctrlWrapper(updateFavorite)

  }