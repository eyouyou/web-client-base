export class JsonSerializer {
    static decode<T>(value: string): T {
        const obj: T = JSON.parse(value)
        return obj
    }

    static encode<T>(value: T): string {
        return JSON.stringify(value)
    }
}