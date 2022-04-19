import React, { useState } from "react"
import { User, UserStore } from "~/models/user"

export const UserContext = React.createContext({
    userStore: UserStore.empty(),
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    addUser: (user: User) => { }
})

interface ProviderProperty {
    children?: React.ReactNode
}

export const UserContextProvider = ({ children }: ProviderProperty) => {
    const [userStore, setUserStore] = useState(UserStore.empty())

    const addUser = (user: User) => {
        userStore.addUser(user)
        setUserStore(userStore.clone())
    }

    return (
        <UserContext.Provider value={{ userStore, addUser }}>
            {children}
        </UserContext.Provider>
    )

}