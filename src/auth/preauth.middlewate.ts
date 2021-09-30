import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import admin, * as firebase from 'firebase-admin';
import * as serviceAccount from './firebaseServiceAccount.json';

declare module "express" { 
    export interface Request {
      user: any
    }
  }
const firebase_params = {
    type: serviceAccount.type,
    projectId: serviceAccount.project_id,
    privateKeyId: serviceAccount.private_key_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
    clientId: serviceAccount.client_id,
    authUri: serviceAccount.auth_uri,
    tokenUri: serviceAccount.token_uri,
    authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
    clientC509CertUrl: serviceAccount.client_x509_cert_url
}

@Injectable()

export class PreauthMiddleware implements NestMiddleware {

    private defaultApp: any;
    admin: any;
  
    constructor() {
        this.defaultApp = firebase.initializeApp({
            credential: firebase.credential.cert(firebase_params),
            databaseURL: "https://fir-auth-bd895.firebaseio.com"
        });
    }

    use(req: Request, res: Response, next: Function) {
        //const uid = '5Nl7HUEhBTZwasm5aNW74BsFQOD2';
        
       // admin.auth().createCustomToken(uid)
        //.then((customToken) => {
      // console.log(customToken);
      //  })
        const token = req.headers.authorization;
        
        if (token != null && token != '') {
           console.log("hi")
            admin.auth().verifyIdToken(token.replace('Bearer ', ''))
                .then(async decodedToken => {
                    const user = {
                        email: decodedToken.email,
                        
                        uid: decodedToken.uid,
                        role :decodedToken.admin
                    }
                    console.log(user)
                    req.user = user;
                    next();
                }).catch(error => {
                    console.log("his")
                    console.error(error);
                    this.accessDenied(req.url, res);
                });
        } else {
            next();
        }
    }

    private accessDenied(url: string, res: Response) {
        res.status(403).json({
            statusCode: 403,
            timestamp: new Date().toISOString(),
            path: url,
            message: 'Access Denied'
        });
    }
}