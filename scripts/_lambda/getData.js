const { readSheetData } = require('../_util/googleSheets');
const { getJwtClient } = require('../_util/googleAuth');
const { throwThis } = require('../_util/errorHandling');
const { unescapeNewLine } = require('../_util/strings');
const projectConfig = require('../_config/project');

// Environment Variables
const envVar = {
  auth: {
    clientEmail: unescapeNewLine(process.env.AUTH_CLIENT_EMAIL),
    privateKey: unescapeNewLine(process.env.AUTH_PRIVATE_KEY),
  },
  sheets: {
    spreadsheetId: unescapeNewLine(process.env.GOOGLE_SPREADSHEET_ID),
  }
};

// Authentication
function getAuth() {
  // get authentication
  const authConfig = Object.assign({
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  }, envVar.auth)
  return getJwtClient(authConfig);
}


// can be abstracted to sheet data helper module
function headedColumnsToNamedArrays(rawValues) {
  // For each column in rawValues,
  //  - pull off name
  //  - make array of values in that column
  //  - filter array to remove empties
  //  - add array to transformed object with appropriate name
  const colNames = rawValues[0];
  const transformedData = colNames.reduce((transformed, colName, ix) => {
    transformed[colName] = rawValues.slice(1)
      .map((row) => {
        return row[ix];
      })
      .filter((value) => {
        return value.length > 0;
      })
    return transformed;
  }, {});

  return transformedData;
}

// can be abstracted to sheet data helper module
function headedColumnsToArrayOfObjects(rawValues) {
  // Pull of column mames
  // For each row in rawValues
  //  - create object with keys named according to columns
  //  - add object to transformed array
  const transformedData = rawValues.slice(1).map((row) => {
    return row.reduce((objectified, value, ix) => {
      objectified[projectConfig.columnOrderData[ix]] = value;
      return objectified;
    }, {});
  });

  return transformedData;
}


// specific to getting configuration
function transformSheetData(rawData) {
  const arrayOfObjects = headedColumnsToArrayOfObjects(rawData.values);

  return arrayOfObjects;
}


async function fetchSheetData(auth) {
  const sheetConfig = {
    auth,
    range: projectConfig.sheetName,
    spreadsheetId: envVar.sheets.spreadsheetId,
  }

  const rawSheetData = await readSheetData(sheetConfig);
  const transformedSheetData = transformSheetData(rawSheetData);

  return transformedSheetData;
}


async function fetchData() {
  // Authenticate
  const auth = await getAuth();

  // Get Data
  const sheetConfigData = await fetchSheetData(auth);

  return sheetConfigData;
}


function getData(event, context, callback) {
  // merely a synchronous wrapper around fetchConfiguration
  console.log('Getting Data...');

  const headers = {
    'Access-Control-Allow-Origin': '*',
  };

  fetchData()
    .then((response) => {
      callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify(response),
      })
    })
    .catch((err) => {
      callback(throwThis('Error getting Data', err), {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          'message': 'Failed',
        }),
      })
    })
}

exports.handler = getData;
