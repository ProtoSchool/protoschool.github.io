/*
    Google Sheets API helpers
 */

import { promisify } from 'util'

import { google } from 'googleapis'

import googleAuth from './auth'

const sheets = google.sheets({ version: 'v4', auth: googleAuth })

export const getSpreadSheet = promisify(sheets.spreadsheets.values.get).bind(sheets.spreadsheets.values)

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
export function transformSpreadSheet(rows, columns, extraColumns = []) { return (
  rows
    // transform each row array into a row object using the columns as keys
    .map(row => row.reduce((mappedRow, value, index) => ({
      ...mappedRow,
      [typeof columns[index] === 'string' ? columns[index] : columns[index].key]: value
    }), {}))
    // run the transform function on each property of each row, if any
    .map((rowObject, index) => {
      let transformedRowObject = {}

      for (const key in rowObject) {
        const transformer = columns.find(column => column === key || column.key === key).transform ||
            ((values, key) => values[key])

        transformedRowObject[key] = transformer(rowObject, key)
      }

      // add the extra columns
      return {
        id: index + 1,
        ...transformedRowObject,
        ...extraColumns.reduce((rowObjectWithNewProperties, extraColumn) => ({
          ...rowObjectWithNewProperties,
          [extraColumn.key]: extraColumn.value(rowObject, transformedRowObject)
        }), {})
      }
    })
)}
