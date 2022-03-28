import express, {Request, response, Response} from 'express';
import mysql from 'mysql';


const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

// connection can be set from command line with:
// // pscale connect animals dev --execute "npm run dev"
const connection = mysql.createConnection( process.env.DATABASE_URL || "" )

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false }));
app.use(express.static('public'));
app.use('/', router);
app.use( errorHandler );

class ApiError{
    code: number;
    message: string;
    constructor( code: number, message: string) {
        this.code = code;
        this.message = message;
    }

    static badRequest(msg: string) {
        return new ApiError( 400, msg );
    }

    static internalError(msg: string) {
        return new ApiError( 500, msg );
    }
}

function errorHandler( err: any, req: Request, res: Response, next: any ) {
    console.error(err);
    if( err instanceof ApiError ) {
        res.status(err.code).json(err.message);
        return
    }
    res.status( 500 ).json( "something went wrong" );
}

app.get('/', (req: Request, res: Response) => {
    res.sendFile(__dirname + "/index.html");
});

app.get('/update', (req: Request, res: Response) => {
    res.sendFile(__dirname + "/update.html");
});


app.get( "/api/animals", (req: Request, res: Response ) => {
    const query = "SELECT * FROM Animal_Data";
    connection.query( query, (err, rows) => {
        if( err ) throw err;
        return res.send( rows );
    })
});

app.get( "/api/animals/:name", (req: Request, res: Response, next ) => {
    var name = req.params.name;
    const query = "SELECT * FROM Animal_Data WHERE name = \"" + name + "\"";
    connection.query( query, (err, rows) => {
        if( err ) throw err;
        if( rows.length === 0 ) {
            next(ApiError.badRequest("no record of this animal in the database"));
            return;
        }
        return res.send( rows );
    })
});

router.post( '/update/animal', (req: Request, res: Response, next ) => {
    var name: string = req.body.name;
    var newName: string = req.body.new_name
    var newLatinName: string = req.body.new_latin_name || "";
    var newImage: string = req.body.new_image || "";
    if( newImage === "" && newLatinName === "" &&  newName === "" ) {
        next(ApiError.badRequest( "no information inputted" ));
        return;
    }
    if( newImage != "" ) {
        var sql = "UPDATE Animal_Data SET image = \"" + newImage + "\" WHERE name = \"" + name + "\"";
        connection.query( sql, (err, result) => {
            if (err) throw err;
            console.log('record updated');
        });
    }
    if( newLatinName != "" ) {
        var sql = "UPDATE Animal_Data SET latin_name = \"" + newLatinName + "\" WHERE name = \"" + name + "\"";
        connection.query( sql, (err, result) => {
            if (err) throw err;
            console.log('record updated');
        });
    }
    if( newName != "" ) {
        var sql = "UPDATE Animal_Data SET name = \"" + newName + "\" WHERE name = \"" + name + "\"";
        connection.query( sql, (err, result) => {
            if (err) throw err;
            console.log('record updated');
        });
    }
    return res.redirect( "/" );
});


router.post('/insert/animal', (req: Request, res: Response, next ) => {
    
    var name: string = req.body.name || "";
    var latin_name: string = req.body.latin_name || "";
    var image: string = req.body.image || "";

    if( name === "" ) {
        next(ApiError.badRequest("message has no content"));
        return;
    }
    var sqlInsert = `INSERT INTO Animal_Data (name, latin_name, image ) VALUES ( "${name}", "${latin_name}", "${image}" );`;
    connection.query(sqlInsert, (err, result) => {
        if (err) throw err;
        console.log('record inserted');
    });
    
    return res.redirect('/');   
});

app.get('/delete/name/:name', function(req: Request, res: Response, next) {
    var name = req.params.name;
    var query = "DELETE FROM Animal_Data WHERE name = " + name;
    connection.query(query, [name], function (err, result) {
        if (err) throw err;
        if( result.length === 0 ) {
            next(ApiError.badRequest("no record of this animal in the database"));
            return;
        }
        console.log(result.affectedRows + " record(s) updated");
    });
    res.redirect('/');
});

app.get('/delete/id/:id', function(req, res, next) {
    var id = req.params.id;
    var query = "DELETE FROM Animal_Data WHERE id = " + id;
    connection.query(query, [id], function (err, result) {
        if (err) throw err;
        if( result.length === 0 ) {
            next(ApiError.badRequest("no record of this animal in the database"));
            return;
        }
        console.log(result.affectedRows + " record(s) updated");
    });
    res.redirect('/');
});
 
// // error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
   
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
//   });

app.get ( "/api/animals/:id", (req: Request, res: Response ) => {
    const id = req.params.id;
    const query = "SELECT * FROM Animal_Data WHERE ID = " + id + " LIMIT 1";
    connection.query( query, (err, rows) => {
        if( err ) throw err;
        const animal = {
            data: rows.length > 0 ? rows[0] : null,
            message: rows.length === 0 ? "No record" : ""
        }
        return res.send( animal );
    })
});

app.get( "/about", (req: Request, res: Response ) => {
    res.send( "This is an API for Reya Co-op Application" );
});

app.listen(port, () => {
    console.log("App is running on port " + port );
});
