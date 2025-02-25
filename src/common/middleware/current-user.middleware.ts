import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Secret, verify } from "jsonwebtoken";
import { UserRespository } from "src/users/user.repository";

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private userRepository: UserRespository) {}

  async use(req: any, res: any, next: () => void) {
    const rawCookie = req.headers.cookie;
    if (!rawCookie) {
      req.currentUser = null;
      return next();
    }

    // Extract token from the cookie header
    const tokenMatch = rawCookie.match(/token=([^;]*)/);
    const token = tokenMatch ? tokenMatch[1] : null;
    console.log("token", token);

    if (!token) {
      req.currentUser = null;
      return next();
    }

    try {
      const JWT_SECRET = process.env.JWT_SECRET as Secret;
      const { id } = verify(token, JWT_SECRET) as JwtPayload;


      const user = await this.userRepository.findOneById(id);
      console.log("user", user);
      if (!user) {
        req.currentUser = null;
      } else {
        req.currentUser = user;
      }
    } catch (error) {
      console.error("JWT verification error:", error);
      req.currentUser = null;
    }

    next();
  }
}

interface JwtPayload {
  id: string,
  email: string,
}