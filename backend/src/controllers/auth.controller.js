import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';


export const register = async (req, res)=>{

    try{
        const {name, email, password } = req.body;

        const existingUser = await prisma.user.findUnique({

            where:{email}

        });

        if (existingUser){
            return res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data:{
                name, 
                email,
                password: hashedPassword
            }
        })
        res.status(201).json({message: "User registered successfully", user});

    } catch (error) {
        res.status(500).json({message: "Error registering user"});
    }
}


export const login = async (req, res)=>{

    try {
        const {email, password} = req.body;

        const user = await prisma.user.findUnique({
            where:{email}
        })

        if (!user){
            return res.status(400).json({
                message: "Invaild credentials",
                success: false
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword){
            return res.status(400).json({
                message: "Invaild credentials",
                success: false
            });
        }

        const token = jwt.sign({id: user.id},
            process.env.JWT_SECRET,
            {expiresIn: "30d"}
        )

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error logging in"
        });
    }

}