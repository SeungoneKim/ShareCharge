const express = require("express");
const app = express();

const mainRouter = require('./router/index')
const addCoinRouter = require('./router/add_coin')
const loginRouter = require('./router/login')
const signupRouter = require('./router/joinus')
const closeChargerRouter = require('./router/find_charger')
const searchChargerRouter = require('./router/inMap')
const getUserChargerRouter = require('./router/user_charger')
const paymentValidCheckRouter = require('./router/paymentValidCheck');
const checkForOwnerRouter = require('./router/checkForOwner');
const admitByOwnerRouter = require('./router/admitByOwner');
const checkForRequestorRouter = require('./router/checkForRequestor');
const applyPaymentRouter = require('./router/applyPayment');
const addChargerRouter = require('./router/addCharger');


//app.use('/addCharger/:price_per_hour/:starting_time/:ending_time/:x/:y/:address_name/:region_1depth_name/:region_2depth_name/:region_3depth_name/:image_src/:email/:owner_name',addChargerRouter);
// /addCharger/10000/12/16/123.56/124.78/서울시 광진구/서울/서울/서울/kimchi/sr7418@yonsei.ac.kr/Joo
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods","POST,GET,OPTIONS,DELETE");	
  next();
});
app.use('/', mainRouter);
app.use('/login',loginRouter);// /login?email=kb064315@gmail.com&token=2
app.use("/signup/:name/:email/:telephone_num/:sns_token",signupRouter); // /signup/Josejusn/b064315@gmail.com/010200797/5
app.use('/purchase_coin/:email/:amount', addCoinRouter); // /purchase_coin/kb064315@gmail.com/3000
app.use('/current/:current_lat/:current_lng',closeChargerRouter); // /current/37.49566/126.99420
app.use('/search/:max_x/:max_y/:min_x/:min_y',searchChargerRouter);// /search/127.00044/37.49938/125.98342/36.49141
app.use('/mypage/:email',getUserChargerRouter)// /mypage/kb064315@gmail.com
app.use('/paymentValidCheck/:email/:charger_key/:starting_time/:ending_time',paymentValidCheckRouter); // /paymentValidCheck/mrseungone@gmail.com/19/15/17
app.use('/checkForOwner/:charger_key',checkForOwnerRouter); // /checkForOwner/19
app.use('/admitByOwner/:charger_key/:yesorno',admitByOwnerRouter); //  /admitByOwner/19/0
app.use('/checkForRequestor/:email',checkForRequestorRouter); //  /checkForRequestor/mrseungone@gmail.com
app.use('/applyPayment/:email/:charger_key/:starting_time/:ending_time',applyPaymentRouter); //
app.use("/addCharger/:price_per_hour/:starting_time/:ending_time/:x/:y/:address_name/:region_1depth_name/:region_2depth_name/:region_3depth_name/:image_src/:email/:owner_name",addChargerRouter);



app.use((req, res, next) => {
    const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});




var sequelize = require('./models').sequelize;
sequelize.sync();



const PORT = 80;
app.listen(PORT);
