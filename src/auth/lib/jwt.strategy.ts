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
    if (req.url.includes('vendor')) {
      if (payload.roles == 'FINANCE') {
        return { id: payload.id, email: payload.email };
      } else {
        return done(
          new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED),
          false,
        );
      }
    } else {
      return { email: payload.email, id: payload.id };
    }
  }
}