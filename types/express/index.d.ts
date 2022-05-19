declare namespace Express {
    interface Request {
        payload: any;
        files:any;
        io:any;
    }
}