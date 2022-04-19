/**
 * @param before参数使用 装饰函数入参
 * @param after参数使用 before返回值以及origin返回值
 */
export function aop<T>(before?: (...args: any[]) => T, beforeParamsReplace?: number, after?: (value: T, ...args: any[]) => T) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const origin = descriptor.value

        descriptor.value = (...args: any[]) => {

            let before_r = null
            const origin_args = [...args]
            if (before != null) {
                before_r = before.apply(target, args)
                if (beforeParamsReplace != null) {
                    origin_args[beforeParamsReplace] = before_r
                } else {
                    origin_args.push(before_r)
                }

            }

            const origin_r = origin.apply(target, origin_args)
            if (after != null) {
                return after.apply(target, [origin_r, ...args])
            }

            return origin_r
        }
    }
}

/**
 * @param [`beforeParamsReplace`] 替换pipe中的参数
 **/
export function before<T>(f: (...args: any[]) => T, beforeParamsReplace?: number): any {
    return aop(f, beforeParamsReplace)
}

export function after<T>(f: (value: T, ...args: any[]) => T): any {
    return aop(undefined, undefined, f)
}
