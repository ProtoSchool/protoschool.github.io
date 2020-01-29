/*
    Google Sheets API helpers
 */

const promisify = require('util').promisify

const { google } = require('googleapis')

const googleAuth = require('./auth')

const sheets = google.sheets({ version: 'v4', auth: googleAuth })

/*
    Fetch data from a spreadsheet
 */
exports.getSpreadSheet = promisify(sheets.spreadsheets.values.get).bind(sheets.spreadsheets.values)

/*
    Transforms a spreadsheet into a usable data structure.

    rows: raw rows from the spreadsheet (spreadsheet.data.values)
    columns:
        - list of columns strings to be used as property names
        - or list of pair {key: string, value: fn}
            - key: string to be used as property name
            - fn(row: Object): transform function to be ran on this column
    extraColumns: extra columns to be added to the row object. list of pair {key: string, value: fn}:
        - key: string to be used as property name
        - fn(row: Object): transform function to be ran on this column
 */
exports.transformSpreadSheet = (rows, columns, extraColumns = []) => (
  rows
    // transform each row array into a row object using the columns as keys
    .map(row => row.reduce((mappedRow, value, index) => ({
      ...mappedRow,
      [typeof columns[index] === 'string' ? columns[index] : columns[index].key]: value
    }), {}))
    // run the transform function on each property of each row, if any
    .map((rowObject, index) => {
      const transformedRowObject = {}

      for (const key in rowObject) {
        const transformer = columns.find(column => column === key || column.key === key).transform ||
            ((values, key) => values[key])

        transformedRowObject[key] = transformer(rowObject, key)
      }

      return {
        id: index,
        ...transformedRowObject
      }
    })
    // add the extra columns
    .map(rowObject => ({
      ...rowObject,
      ...extraColumns.reduce((rowObjectWithNewProperties, extraColumn) => ({
        ...rowObjectWithNewProperties,
        [extraColumn.key]: extraColumn.value(rowObject)
      }), {})
    }))
)
