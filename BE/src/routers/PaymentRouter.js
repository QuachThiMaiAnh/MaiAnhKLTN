import express from 'express';
import { format } from 'date-fns'; // Sử dụng date-fns thay cho moment
import axios from 'axios'; // Sử dụng axios thay cho request
import crypto from 'crypto';
import qs from 'qs';

const PaymentRouter = express.Router();

// Dữ liệu truyền vào
// Truy cập các biến môi trường
const vnp_TmnCode = process.env.VNP_TMN_CODE;
const vnp_HashSecret = process.env.VNP_HASH_SECRET;
const vnp_Url = process.env.VNP_URL;
const vnp_Api = process.env.VNP_API;
const vnp_ReturnUrl = process.env.VNP_RETURN_URL;

// Các route
PaymentRouter.get('/', (req, res) => {
    res.render('orderlist', { title: 'Danh sách đơn hàng' });
});

PaymentRouter.get('/create_payment_url', (req, res) => {
    res.render('order', { title: 'Tạo mới đơn hàng', amount: 10000 });
});

PaymentRouter.get('/querydr', (req, res) => {
    res.render('querydr', { title: 'Truy vấn kết quả thanh toán' });
});

PaymentRouter.get('/refund', (req, res) => {
    res.render('refund', { title: 'Hoàn tiền giao dịch thanh toán' });
});

// Tạo URL thanh toán
PaymentRouter.post('/create_payment_url', async (req, res) => {

    process.env.TZ = 'Asia/Ho_Chi_Minh';
    const date = new Date();
    const createDate = format(date, 'yyyyMMddHHmmss');
    const ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    const orderId = format(date, 'ddHHmmss');
    const amount = req.body.amount;
    const orderCode = req.body.orderCode;
    const bankCode = req.body.bankCode;
    let locale = req.body.language || 'vn';
    const currCode = 'VND';

    let vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: vnp_TmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: currCode,
        vnp_TxnRef: orderCode,
        vnp_OrderInfo: `Thanh toan cho ma GD: ${orderCode}`,
        vnp_OrderType: 'other',
        vnp_Amount: amount * 100,
        vnp_ReturnUrl: vnp_ReturnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
    };

    if (bankCode) vnp_Params['vnp_BankCode'] = bankCode;

    vnp_Params = sortObject(vnp_Params);

    const signData = new URLSearchParams(vnp_Params).toString();
    const signed = crypto.createHmac('sha512', vnp_HashSecret)
        .update(Buffer.from(signData, 'utf-8'))
        .digest('hex');

    vnp_Params['vnp_SecureHash'] = signed;
    const redirectUrl = vnp_Url + '?' + new URLSearchParams(vnp_Params).toString();
    console.log('Redirect URL:', redirectUrl);
    // res.redirect(redirectUrl);
    res.json({ redirectUrl });
});

// Xử lý trả về từ VNPay
PaymentRouter.get('/vnpay_return', (req, res) => {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    const signData = new URLSearchParams(vnp_Params).toString();
    // Tạo chữ ký HMAC SHA-512 giống như trong /create_payment_url
    const signed = crypto.createHmac('sha512', vnp_HashSecret)
        .update(Buffer.from(signData, 'utf-8'))
        .digest('hex');

    if (secureHash === signed) {
        res.json({ code: vnp_Params['vnp_ResponseCode'] });
    } else {
        res.json({ code: '97' });
    }
});


// Xử lý IPN (Instant Payment Notification)
PaymentRouter.get('/vnpay_ipn', async (req, res) => {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];
    const orderId = vnp_Params['vnp_TxnRef'];
    const rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false });
    const signed = crypto.createHmac('sha512', vnp_HashSecret)
        .update(Buffer.from(signData, 'utf-8'))
        .digest('hex');

    const paymentStatus = '0';
    const checkOrderId = true;
    const checkAmount = true;

    if (secureHash === signed) {
        if (checkOrderId && checkAmount) {
            if (paymentStatus === "0") {
                res.status(200).json({ RspCode: '00', Message: 'Success' });
            } else {
                res.status(200).json({ RspCode: '02', Message: 'This order has been updated to the payment status' });
            }
        } else {
            res.status(200).json({ RspCode: '04', Message: 'Amount invalid' });
        }
    } else {
        res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
    }
});

// Truy vấn thông tin giao dịch
PaymentRouter.post('/querydr', async (req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    const date = new Date();

    const vnp_TxnRef = req.body.orderId;
    const vnp_TransactionDate = req.body.transDate;

    const vnp_RequestId = format(date, 'HHmmss');
    const vnp_Version = '2.1.0';
    const vnp_Command = 'querydr';
    const vnp_OrderInfo = `Truy van GD ma: ${vnp_TxnRef}`;

    const vnp_IpAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    const vnp_CreateDate = format(date, 'yyyyMMddHHmmss');

    const data = `${vnp_RequestId}|${vnp_Version}|${vnp_Command}|${vnp_TmnCode}|${vnp_TxnRef}|${vnp_TransactionDate}|${vnp_CreateDate}|${vnp_IpAddr}|${vnp_OrderInfo}`;

    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const vnp_SecureHash = hmac.update(Buffer.from(data, 'utf-8')).digest('hex');

    const dataObj = {
        vnp_RequestId,
        vnp_Version,
        vnp_Command,
        vnp_TmnCode,
        vnp_TxnRef,
        vnp_OrderInfo,
        vnp_TransactionDate,
        vnp_CreateDate,
        vnp_IpAddr,
        vnp_SecureHash,
    };

    try {
        const response = await axios.post(vnp_Api, dataObj);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
});

// Hoàn tiền giao dịch
PaymentRouter.post('/refund', async (req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    const date = new Date();

    const vnp_TxnRef = req.body.orderId;
    const vnp_TransactionDate = req.body.transDate;
    const vnp_Amount = req.body.amount * 100;
    const vnp_TransactionType = req.body.transType;
    const vnp_CreateBy = req.body.user;

    const currCode = 'VND';
    const vnp_RequestId = format(date, 'HHmmss');
    const vnp_Version = '2.1.0';
    const vnp_Command = 'refund';
    const vnp_OrderInfo = `Hoan tien GD ma: ${vnp_TxnRef}`;

    const vnp_IpAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    const vnp_CreateDate = format(date, 'yyyyMMddHHmmss');
    const vnp_TransactionNo = req.body.transNo;

    const data = `${vnp_RequestId}|${vnp_Version}|${vnp_Command}|${vnp_TmnCode}|${vnp_TxnRef}|${vnp_TransactionDate}|${vnp_TransactionNo}|${vnp_Amount}|${vnp_CreateDate}|${vnp_CreateBy}|${vnp_IpAddr}|${vnp_OrderInfo}`;

    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const vnp_SecureHash = hmac.update(Buffer.from(data, 'utf-8')).digest('hex');

    const dataObj = {
        vnp_RequestId,
        vnp_Version,
        vnp_Command,
        vnp_TmnCode,
        vnp_TxnRef,
        vnp_TransactionDate,
        vnp_TransactionNo,
        vnp_Amount,
        vnp_TransactionType,
        vnp_CreateDate,
        vnp_CreateBy,
        vnp_IpAddr,
        vnp_SecureHash,
    };

    try {
        const response = await axios.post(vnp_Api, dataObj);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
});

// Phương thức hỗ trợ
function sortObject(obj) {
    const sortedKeys = Object.keys(obj).sort();
    const sortedObj = {};
    sortedKeys.forEach((key) => {
        sortedObj[key] = obj[key];
    });
    return sortedObj;
}

export default PaymentRouter;
