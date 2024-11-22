import express, { Request, Response } from "express"
import { registerUser, loginUser } from "../services/auth.service"
import { validateLogin, validateRegister } from "../middlewares/auth.middleware"


const router = express.Router()

router.post(
    "/register",
    validateRegister,
    async (req: Request, res: Response) => {
        const { email, password, role, name, companyRefId,token } = req.body
       console.log(req.body);
       
        
        try {
            
            // const response:any = await registerUser(
            //     email,
            //     password,
            //     role,
            //     name,
            //     companyRefId,token
            // )
            const response:any = await registerUser(req.body)
            if (response.message === "Email already exists for this role") {
                res.status(409).json(response)
            }
            else{
                res.status(201).json(response)
            }
            
            
            

        } catch (error:any) {
            
            res.status(500).json({ message: ' Internal Server Error' })
            
        }
    }
)

router.post("/login", validateLogin, async (req: Request, res: Response) => {
    const { username, password } = req.body
    try {
        const response = await loginUser(username, password)
        console.log(response);
        
        res.status(200).json(response)
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message })
        } else {
            res.status(500).json({ error: "An unknown error occurred" })
        }
    }
})

export default router
