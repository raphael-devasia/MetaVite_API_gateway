const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")
import path from "path"

const PROTO_PATH = path.join(__dirname, "../../../protos/auth.proto")
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})
const authProto = grpc.loadPackageDefinition(packageDefinition).auth



const client = new (authProto as any).AuthService(
    "localhost:3001",
    grpc.credentials.createInsecure()
)

export const registerUserInDB = (
    email: string,
    password: string,
    role: string,
    name: {},
    token:string,
    companyRefId:string
) => {
    return new Promise((resolve, reject) => {
       

        client.Register(
            { email, password, name, role, companyRefId,token },
            (error: any, response: any) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(response)
                }
            }
        )
    })
}

export const loginUserInDB = (username: string, password: string) => {
    return new Promise((resolve, reject) => {
        client.Login({ username, password }, (error: any, response: any) => {
            if (error) {
                reject(error)
            } else {
                resolve(response)
                
            }
        })
    })
}
