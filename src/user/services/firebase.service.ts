import { Injectable, UnauthorizedException } from '@nestjs/common';
import admin from 'firebase-admin';
import { Logger } from 'typeorm';



@Injectable()
export class FirebaseAuthService {

  constructor(
    private logger: Logger,
  ) { }

  private getToken(authToken: string): string {
    const match = authToken.match(/^Bearer (.*)$/);
    if (!match || match.length < 2) {
     console.log("error")
    }
    return match[1];
  }
  public async authenticate(authToken: string): Promise<any> {
    const tokenString = this.getToken(authToken);
    try {
      const decodedToken: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(tokenString);
     
      console.log(decodedToken);
      const  {
        email,
        uid,
        role
      } = decodedToken;
      return { email, uid, role};
    } catch (err) {
      
      throw new UnauthorizedException(err.message);
    }
  }
}