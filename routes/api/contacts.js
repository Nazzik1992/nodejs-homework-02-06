const express = require("express");
const router = express.Router();
const contactsController = require("../../controllers/contacts-controller");
const { schemas } = require("../../shemas/contactsSchema");
const {isValidId, authenticate, upload } = require("../../middlewares")
const { validateBody } = require("../../decoretors");


router.use(authenticate);

router.get("/", contactsController.getAllContacts);

router.get("/:id", isValidId, contactsController.getContactById);

router.post("/", validateBody(schemas.contactAddSchema), contactsController.addContact);

router.delete("/:id", isValidId, contactsController.deleteContactById);

router.put("/:id",isValidId, validateBody(schemas.contactAddSchema), contactsController.updateContactById);

router.patch("/:id/favorite", isValidId, validateBody(schemas.updateFavoriteSchema), contactsController.updateFavorite)

module.exports = router;

