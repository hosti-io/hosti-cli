export class InvalidRequestException extends Error {
    readonly message : string;
    readonly statusCode : number;
    readonly statusText : string;

    constructor(statusCode: number, statusText: string, message: string) {
        super();
        this.statusText = statusText;
        this.message = message;
        this.statusCode = statusCode;
    }

    public toString = () : string => {
        return `Request failed with status: " ${this.statusText} (HTTP: ${this.statusCode} )" and error message: ${this.message}`;
    }

}
