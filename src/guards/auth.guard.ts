import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

interface Request {
  headers: Record<string, string>;
  [key: string]: any;
}

interface JwtPayload {
  sub: string;
  email?: string;
  role?: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject("LoggerService") private readonly logger: any
  ) {
    this.logger.contextName = AuthGuard.name;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    this.assertValidToken(token);

    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>("JWT_SECRET"),
      });
    } catch (e: any) {
      this.logger.error(`Token validation failed: ${e.name} - ${e.message}`);
      throw new UnauthorizedException({
        message: "Invalid token",
        statusCode: 401,
      });
    }

    this.assertPayloadHasSub(payload);

    request["user"] = payload;
    return true;
  }

    private assertValidToken(token: string | undefined): asserts token is string {
        if (!token) {
            throw new UnauthorizedException({
                message: "Token not provided",
                statusCode: 401,
            });
        }
    }

  private assertPayloadHasSub(payload: JwtPayload) {
    if (!payload?.sub) {
      this.logger.warn("Token payload missing sub claim");
      throw new UnauthorizedException({
        message: "Invalid token payload",
        statusCode: 401,
      });
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
