
declare const BUILD_DATA: object
declare const DEBUG_MODE: string

declare module '*.less'
declare module 'path-browserify' {
  import path from 'path'
  export default path
}

/**
 * 扩展array
 */
interface Array<T> {
  trim<U extends T>(): U[]
  distinct<PT,>(predicate: (value: T, index: number) => PT, thisArg?: any): T[]
}
