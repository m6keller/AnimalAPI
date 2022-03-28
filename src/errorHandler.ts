import {Request, Response } from 'express';
import { ApiError } from './error';

export function errorHandler( err: any, req: Request, res: Response, next: any ) {
    console.error(err);

    // below checks if error is an expected error
    if( err instanceof ApiError ) {
        res.status(err.code).json(err.message);
        return
    }
    res.status( 500 ).json( "something went wrong" );
}

module.exports = errorHandler;