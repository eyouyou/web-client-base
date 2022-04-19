export class User {
    account: string
    constructor(account: string) {
        this.account = account
    }
}

export class UserStore {
    userList: Map<string, User>
    constructor(users: Map<string, User>) {
        this.userList = users
    }
    static empty(): UserStore {
        return new UserStore(new Map<string, User>())
    }
    addUser(user: User) {
        this.userList.set(user.account, user)
    }

    clone() {
        return new UserStore(this.userList)
    }
}