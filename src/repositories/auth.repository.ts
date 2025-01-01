const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")
import path from "path"
import { IUser, IUserInvitation } from "../models/user.models"

const PROTO_PATH = path.join(__dirname, "../../../protos/auth.proto")

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})
const authProto = grpc.loadPackageDefinition(packageDefinition).auth




const auth_client = new (authProto as any).AuthService(
    "localhost:3001",
    grpc.credentials.createInsecure()
)
const verification_client = new (authProto as any).AuthService(
    "localhost:3005",
    grpc.credentials.createInsecure()
)




export const registerUserInDB = (
    user:IUser
) => {
    return new Promise((resolve, reject) => {
       
console.log(user);

        auth_client.Register({ user }, (error: any, response: any) => {
            if (error) {
                reject(error)
            } else {
                resolve(response)
            }
        })
    })
}

export const InvitedUserVerification = (user: IUserInvitation) => {
    return new Promise((resolve, reject) => {
        console.log(user)

        verification_client.ValidateRegister({ user }, (error: any, response: any) => {
            if (error) {
                reject(error)
            } else {
                resolve(response)
            }
        })
    })
}

