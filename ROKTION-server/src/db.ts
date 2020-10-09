import mongoose from 'mongoose';

const uri = 'mongodb+srv://new-user-1:akTMqbpSzJYOjZTP@roktion.do4pn.gcp.mongodb.net/roktion?retryWrites=true&w=majority';

export class DB {
    constructor() {
    }

    initalConnect() {
        const connect = () => {
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
        }
        connect();
        mongoose.connection.on('disconnected', connect);
    
        require('./schemas/user');
        require('./schemas/doc');
        require('./schemas/docInfo');
    }
}
