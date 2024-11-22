import { Request, Response, NextFunction, RequestHandler } from "express"
import { body, validationResult } from "express-validator"

export const validateRegister: RequestHandler[] = [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    body("role")
        .isIn(["shipperStaff", "appAdmin","driver","carrierAdmin","shipperAdmin"])
        .withMessage("Invalid role"),
    body("name.firstName").notEmpty().withMessage("First name is required"),
    body("name.lastName").notEmpty().withMessage("Last name is required"),
    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
        } else {
            next()
        }
    },
]

export const validateLogin: RequestHandler[] = [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
        } else {
            next()
        }
    },
]
