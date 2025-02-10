import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class IsSameUserGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        

        try {
            const userIdFromToken = request.currentUser; // Assuming `currentUser` is set by authentication middleware
            const userIdFromParam = request.params.id; // Extract from request params

            return userIdFromToken === userIdFromParam; // Compare both values
        } catch (error) {
            return false;
        }
    }
}
