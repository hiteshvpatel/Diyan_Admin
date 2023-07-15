import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {

    constructor() { }

    getValue(key: string): string {
        return localStorage.getItem(key);
    }

    setValue(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    removeValue(key: string): void {
        localStorage.removeItem(key);
    }

}


export class StorageKey {

    public static myToken = 'myToken';
    public static _id = '_id';
    public static employeeId = 'employeeId';
    public static firstName = 'firstName';
    public static middleName = 'middleName';
    public static lastName = 'lastName';
    public static email = 'email';
    public static p_Email = 'p_Email';
    public static accountType = 'accountType';
    public static roleType = 'roleType';
    public static profileImage = 'profileImage';
    public static IsDiyanLogin = 'IsDiyanLogin';

}
