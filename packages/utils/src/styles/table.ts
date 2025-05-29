
import Table     from 'cli-table3'
import columnify from 'columnify'

import type { TableConstructorOptions } from 'cli-table3'

export type TableData = string[][]
export type TableOpts = TableConstructorOptions

export type ColumnOpts = columnify.GlobalOptions
export type ColumnData = Record<string, unknown> | Record<string, unknown>[]

export type { TableConstructorOptions }
export { Table }

/**
 * Generates a text-based table from the provided data array.
 *
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
export const table = ( data: TableData, options?: TableConstructorOptions ): string => {

	const _table = new Table( options )
	_table.push( ...data )

	return _table.toString()

}

/**
 * Formats data into aligned columns for better readability.
 *
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
export const columns = <Data extends ColumnData>( data: Data, options?: ColumnOpts ): string =>
	columnify( data, options )
