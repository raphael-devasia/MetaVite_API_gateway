import {
    registerUserInDB,
    loginUserInDB,
} from "../repositories/auth.repository"


import { v4 as uuidv4 } from "uuid"
import { publishToQueue } from "./messaging.service"

export const registerUser:any = async (
    // email: string,
    // password: string,
    // role: string,
    // name: { firstName: string; lastName: string },
    // companyRefId:string,
    // token:string
    user:any
) => {
    let data = user

    if (user.role === "shipperAdmin" || user.role === "carrierAdmin") {
        user.companyRefId = generateCompanyRefId(user.role)
        
    }
       

    const userRegister:any= await registerUserInDB(
        user.email,
        user.password,
        user.role,
        user.name,
        user.token,
        user.companyRefId
    )
    
    
    const userId = userRegister.user.id
    data = { ...data, userId }
   if(userRegister.user.role=='carrierAdmin'){
try {
    await publishToQueue("carrierServiceQueue", JSON.stringify(data))
    console.log("Message published to carrierServiceQueue")
} catch (messageError) {
    console.error("Error publishing to queue:", messageError)
}
   } else if (userRegister.user.role == "shipperAdmin") {
    try {
        await publishToQueue("shipperServiceQueue", JSON.stringify(data))
        console.log("Message published to shipperServiceQueue")
    } catch (messageError) {
        console.error("Error publishing to queue:", messageError)
    }
   }

 


    return userRegister
}

export const loginUser = async (username: string, password: string) => {
    return await loginUserInDB(username, password)
}

// Helper function to generate a unique companyRefId
const generateCompanyRefId = (role: string): string => {
    const prefix = role === "shipperAdmin" ? "SH" : "CA" // Prefix for shipper or carrier
    const uniqueId = uuidv4().split("-")[0].toUpperCase() 
    return `${prefix}${uniqueId}`
}
