import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";



@Injectable()
export class AuthenticationGaurd implements CanActivate{

    canActivate(context: ExecutionContext): boolean   {

    
        const request = context.switchToHttp().getRequest();

        return request.currentUser;
    }


}
