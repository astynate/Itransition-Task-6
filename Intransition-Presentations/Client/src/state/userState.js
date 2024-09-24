import { makeAutoObservable } from "mobx";

class UserState {
    username = undefined;
    color = undefined;

    constructor() {
        makeAutoObservable(this);
    }

    SetUserData(username, color) {
        this.username = username;
        this.color = color;
    }
}

export default new UserState();