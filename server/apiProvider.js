/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
const path = require('path');
const url = require('url');
const apiMapping = require('./apiResponseMapping');

const apiFilesDir = 'app/json';
const cwd = process.cwd();

/*
Sample endpoint:
/digital/tradein/creditAjax?questions=${questionsData}&deviceId=${deviceIdData}
*/

function _resolveFileName(reqPath) {
  return url.parse(reqPath).pathname;
}

function _getFileMeta(expectedPath) {
  return apiMapping.filter((a) => a.endPoint === expectedPath);
}

function _filterResponseData(data, expectedFields) {
  expectedFields.split(',');
  const returnData = {};

  if (!expectedFields.length) {
    return returnData;
  }

  if (expectedFields.indexOf('*') !== -1) {
    return data;
  } if (expectedFields.length === 1) {
    if (data.hasOwnProperty(expectedFields[0])) {
      return data[expectedFields[0]];
    }
    return returnData;
  }

  for (const key in data) {
    if (data.hasOwnProperty(key) && expectedFields.indexOf(key) !== -1) {
      returnData[key] = data[key];
    }
  }

  return returnData;
}

exports.getApiResponse = apiEndpoint => {
  const expecteFilePath = _resolveFileName(apiEndpoint);
  let respData;
  const fileMeta = _getFileMeta(expecteFilePath);

  if (!fileMeta.length) {
    return { "error": true };
  }

  const fileNameWithPath = path.join(cwd, apiFilesDir, fileMeta[0].fileName);

  try {
    respData = require(fileNameWithPath);
  } catch (e) {
    respData = false;
  }

  if (!respData) {
    return { "error": true };
  }

  return _filterResponseData(respData, fileMeta[0].fields);
};
