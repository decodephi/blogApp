import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const likeBlog = async (req,res)=>{

 const like = await prisma.like.create({

   data:{
     userId:req.user.id,
     blogId:req.params.id
   }

 });

 res.json(like);

};