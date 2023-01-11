interface Array<T> {
    /** 过滤非U 如undefined | null  */
    trim<U extends T>(): U[],
    distinct<PT,>(predicate: (value: T, index: number) => PT, thisArg?: any): T[]
}

if (!Array.prototype.trim) {
    Array.prototype.trim = function <T, U extends T>(): U[] {
        return this.filter((item): item is U => !!item)
    }
}

if (!Array.prototype.distinct) {
    Array.prototype.distinct = function <T, PT>(predicate: (value: T, index: number) => PT, thisArg?: any): T[] {
        const newArr: T[] = []

        const obj = new Map()

        this.forEach((item, index) => {
            const value = predicate(item, index)
            if (!obj.get(value)) {
                newArr.push(item)
                obj.set(value, true)
            }
        })

        return newArr
    }
}


export default {}
