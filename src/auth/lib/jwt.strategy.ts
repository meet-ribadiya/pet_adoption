import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import e from 'express';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: e.Request, payload: any, done: VerifiedCallback) {
    const url = req.url;

    const routeRoleMap = [
      { path: 'admin', role: 'ADMIN' },
      { path: 'user', role: 'USER' },
    ];

    for (const route of routeRoleMap) {
      if (url.includes(route.path)) {
        if (payload.roles === route.role) {
          console.log("🚀 ~ JwtStrategy ~ validate ~ email:", payload.userEmail)
          return { id: payload.id, email: payload.userEmail };
        } else {
          return done(
            new HttpException(`Unauthorized ${route.role} access`, HttpStatus.UNAUTHORIZED),
            false,
          );
        }
      }
    }

    return { id: payload.id, email: payload.userEmail };
  }
}