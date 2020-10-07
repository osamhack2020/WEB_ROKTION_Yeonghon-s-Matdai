import mongoose from 'mongoose';

const uri = 'mongodb://localhost:27017/roktion_dev';

export class DB {
    constructor() {
        mongoose.set('useCreateIndex', true);
    }

    initalConnect() {
        const connect = () => {
            mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }, (err) => {
                if (err) {
                    console.error('DB connection error', err);
                } else {
                    console.log('DB connected');
                }
            });
        }
        connect();
        mongoose.connection.on('disconnected', connect);
    
        require('./schemas/user');
        require('./schemas/docs');
        require('./schemas/docsInfo');
    }
}
