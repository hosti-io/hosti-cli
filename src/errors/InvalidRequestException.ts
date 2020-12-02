export class InvalidRequestException extends Error {
    readonly message : string;
    readonly statusCode : number;

    constructor(statusCode: number, message: string) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }

    public toString = () : string => {
        return `Request failed with status code (${this.statusCode}) and error message: ${this.message}`;
    }

}
