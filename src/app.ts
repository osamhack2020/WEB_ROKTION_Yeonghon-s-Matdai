import express, {Request, Response, NextFunction} from 'express';
import { ppid } from 'process';
import router from './router/router';

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req:Request, res:Response, next:NextFunction) => {
    res.render('index.html')
})

app.use('/router', router);

app.listen(3000, () => {
    console.log('Server start at http://localhost:3000/');
})
