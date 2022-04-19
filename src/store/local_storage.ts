import { after, before } from "~/common/aop"
import { JsonSerializer } from "~/common/json"

class WebLocalStorage {
    //! 本地存储

    @after<string>(JsonSerializer.decode)
    getItem(key: string) {
        return window.localStorage.getItem(key)
    }

    @before((_, v) => JsonSerializer.encode(v), 1)
    setItem<T>(key: string, value: T) {
        window.localStorage.setItem(key, `${value}`)
    }

}

const webLocalStorage = new WebLocalStorage()
export { webLocalStorage }