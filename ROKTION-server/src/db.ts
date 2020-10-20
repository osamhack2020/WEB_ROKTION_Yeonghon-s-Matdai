import mongoose from 'mongoose';
import fs from 'fs';

let uri = '@roktion.do4pn.gcp.mongodb.net/roktion?retryWrites=true&w=majority';

export class DB {
    initalConnect() {
        const connect = () => {
            fs.promises.readFile( __dirname + '/../DBAUTH')
            .then(data => {
                let authData;
                if (data[data.length - 1] == 0x0a) {
                    authData = data.slice(0, -1);
                } else {
                    authData = data;
                }
                return 'mongodb+srv://' + authData + uri;
            })
            .then(uri => {
                mongoose.connect(uri, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true,
                }, (err) => {
                    if (err) {
                        console.error('DB connection error', err);
                    } else {
                        console.log('DB connected');
                    }
                });
            })
            .catch(err => {
                console.error(err);
            });
        }
        connect();
        mongoose.connection.on('disconnected', connect);
    
        require('./schemas/user');
        require('./schemas/doc');
        require('./schemas/docInfo');
    }
}
