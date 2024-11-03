import boxen                   from 'boxen'
import columnify               from 'columnify'
import { table as tableFunct } from 'table'

import type { Options }         from 'boxen'
import type { TableUserConfig } from 'table/dist/src/types/api'

export type TableData = unknown[][]
export type TableOpts = TableUserConfig
export type BoxOpts = Options
export type ColumnOpts = columnify.GlobalOptions
export type ColumnData = Record<string, unknown> | Record<string, unknown>[]

/**
 * Generates a text-based table from the provided data array.
 * @param   {TableData} data      - The data to display in the table.
 * @param   {TableOpts} [options] - Optional configuration options for the table.
 * @returns {string}              - The text-based table.
 * @see https://www.npmjs.com/package/table
 * @example
 * const data = [
 *     ['Name', 'Age', 'Country'],
 *     ['John', 30, 'USA'],
 *     ['Alice', 25, 'UK'],
 *     ['Bob', 35, 'Canada'],
 * ];
 * const tableText = table(data);
 * console.log(tableText);
 */
export const table = ( data: TableData, options?: TableOpts ): string => tableFunct( data, options )

/**
 * Creates a styled box around the provided text.
 * @param   {string}  text      - The text to display inside the box.
 * @param   {BoxOpts} [options] - Optional configuration options for the box.
 * @returns {string}            - The text with the styled box around it.
 * @see https://www.npmjs.com/package/boxen
 * @example
 * const boxedText = box('This is a boxed text', { padding: 1 });
 * console.log(boxedText);
 */
export const box = ( text: string, options?: BoxOpts ): string => boxen( text, options )

/**
 * Formats data into aligned columns for better readability.
 * @param   {ColumnData} data      - The data to format into columns.
 * @param   {ColumnOpts} [options] - Optional configuration options for column formatting.
 * @returns {string}               - The text with the data formatted into columns.
 * @see https://www.npmjs.com/package/columnify
 * @example
 * // data for columns
 * const data = [
 *     {
 *         name: 'mod1',
 *         description: 'some description which happens to be far larger than the max',
 *         version: '0.0.1',
 *     },
 *     {
 *         name: 'module-two',
 *         description: 'another description larger than the max',
 *         version: '0.2.0',
 *     }
 * ];
 *
 * // set columns with custom config
 * const columnText = columns(data, {
 *     showHeaders: false,
 *     minWidth: 20,
 *     config: {
 *         description: {
 *             maxWidth: 30
 *         }
 *     }
 * });
 *
 * // print columns
 * console.log(columnText);
 */
export const columns = <Data extends ColumnData>( data: Data, options?: ColumnOpts ): string => columnify( data, options )
