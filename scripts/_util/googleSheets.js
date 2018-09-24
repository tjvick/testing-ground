import { google } from 'googleapis';
import { throwThis } from './errorHandling';

let sheets = google.sheets('v4');


// read sheet data
export function readSheetData(sheetConfig) {
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get({
      auth: sheetConfig.auth,
      spreadsheetId: sheetConfig.spreadsheetId,
      range: sheetConfig.range,
    }, function(err, response) {
      if (err) {
        reject(throwThis('Failure during Google Sheets API request (get)', err));
      } else {
        resolve(response.data);
      }
    })
  })
}


// append sheet data
export function appendSheetData(sheetConfig, dataBody) {
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.append({
      auth: sheetConfig.auth,
      spreadsheetId: sheetConfig.spreadsheetId,
      range: sheetConfig.range,
      valueInputOption: 'USER_ENTERED',
      resource: dataBody,
    }, function(err, response) {
      if (err) {
        reject(throwThis('Failure during Google Sheets API request (append)', err));
      } else {
        resolve(response.data);
      }
    })
  })
}