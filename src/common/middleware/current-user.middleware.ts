import { Injectable, NestMiddleware } from "@nestjs/common";
import { isArray } from "class-validator";
import { Secret, verify } from "jsonwebtoken";
import { UsersService } from "src/users/users.service";


@Injectable()
export class CurrentUserMiddleware implements NestMiddleware{


    constructor( private userService: UsersService){}

    async use(req: any, res: any, next: () => void){

        const authHeader= req.headers.authorization || req.headers.Authorization;
        if(!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer ')){
            req.currentUser=null;
        }
        else{
            try {
                const token= authHeader.split(' ')[1];
                const JWT_SECRET= process.env.JWT_SECRET as Secret
                const {id}= <JwtPayload> verify(token, JWT_SECRET)
                console.log(id);
                const cUser= await this.userService.findOne(id)
                req.currentUser=cUser;
              } catch (error) {
                   req.currentUser=null;
                   
              }
        }


    }
}

interface JwtPayload {
    id: string;
    email: string;
}
