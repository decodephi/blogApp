import express from "express";

import authMiddleware
from "../middleware/auth.middleware.js";

import {

 addComment,

 replyComment,

 getComments,

 deleteComment

}
from "../controllers/comment.controller.js";

const router = express.Router();

router.post(
 "/:blogId",
 authMiddleware,
 addComment
);


router.post(
 "/:blogId/:commentId/reply",
 authMiddleware,
 replyComment
);

router.get(
 "/:blogId",
 getComments
);


router.delete(
 "/:id",
 authMiddleware,
 deleteComment
);


export default router;