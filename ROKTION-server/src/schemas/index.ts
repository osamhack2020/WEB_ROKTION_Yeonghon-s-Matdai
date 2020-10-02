import mongoose, { connect } from 'mongoose';

export default () => {
    const connect = () => {
        mongoose.connect('mongodb://localhost:27017', (err) => {
            if (err) {
                console.error('DB connection error', err);
            } else {
                console.log('DB connected');
            }
        });
    }
    connect();
    mongoose.connection.on('disconnected', connect);

    require('./user');
}
