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
function headedColumnsToArrayOfObjects(rawValues) {
  // Pull of column mames
  // For each row in rawValues
  //  - create object with keys named according to columns
  //  - add object to transformed array
  const transformedData = rawValues.slice(1).map((row) => {
    return row.reduce((objectified, value, ix) => {
      objectified[projectConfig.columnOrderDataGrouped[ix]] = value;
      return objectified;
    }, {});
  });

  return transformedData;
}

function splitNewLines(rows) {
  return rows.map((row) => {
    return Object.entries(row).reduce((accumulator, [key, value]) => {
      accumulator[key] = value.split(/\r?\n/);
      return accumulator;
    }, {});
  });
}

function allEqual(array) {
  return array.every(el => el === array[0]);
}

function isBlank(property) {
  return (
    property === undefined ||
    property === '' ||
    property === ['']
  );
}


function attachNamesLocations(rows) {
  return rows.map((row) => {
    let people = [];
    if (row.peopleNames[0] === '') {
      return people;
    }


    if (isBlank(row.peopleLocations)) {
      people = row.peopleNames.map(name => ({ name }));
    } else if (allEqual(row.peopleLocations)) {
      people = row.peopleNames.map(name => ({ name }));
      people[people.length - 1].location = row.peopleLocations[0];
    } else if (row.peopleNames.length === row.peopleLocations.length) {
      people = row.peopleNames.map((name, ix) => {
        return {
          name,
          location: row.peopleLocations[ix],
        };
      });
    } else if (row.peopleLocations.length === 1) {
      people = row.peopleNames.map(name => ({ name }));
      people[people.length - 1].location = row.peopleLocations[0];
    }

    console.log(row.peopleNames);
    console.log(row.peopleLocations);
    console.log(people);

    return {
      ...row,
      people,
    }
  });
}

// specific to getting configuration
function transformSheetData(rawData) {
  const arrayOfObjects = headedColumnsToArrayOfObjects(rawData.values);

  const splitRows = splitNewLines(arrayOfObjects);

  const namesLocations = attachNamesLocations(splitRows);

  return namesLocations;
}


async function fetchSheetData(auth) {
  const sheetConfig = {
    auth,
    range: projectConfig.sheetNameGroups,
    spreadsheetId: envVar.sheets.spreadsheetId,
  }

  const rawSheetData = await readSheetData(sheetConfig);
  // console.log(rawSheetData.values);
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
