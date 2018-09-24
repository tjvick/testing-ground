import { google } from 'googleapis';
import { throwThis } from './errorHandling';

export function getJwtClient(authConfig) {
  return new Promise((resolve, reject) => {
    const jwtClient = new google.auth.JWT(
      authConfig.clientEmail,
      null,
      authConfig.privateKey,
      authConfig.scopes,
    );

    // authenticate request
    jwtClient.authorize((err, tokens) => {
      if (err) {
        reject(throwThis('Failure during JWT client authorization', err));
      } else {
        resolve(jwtClient);
      }
    });
  });
}
