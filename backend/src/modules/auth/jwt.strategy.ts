import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { config } from "dotenv";
import { ExtractJwt, Strategy } from "passport-jwt";

config() // load env vars
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            secretOrKey: `${process.env.SEGREDO_JWT}`,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false
        })
    }
    async validate(payload: any) {
        return { 
            sub: payload.sub, 
            user_id: payload.id, 
            email: payload.email,
            role: payload.role
        }; // Retorna apenas os dados necessários
    }
    
}