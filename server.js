const express = require('express');
const paypal = require('@paypal/checkout-server-sdk');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// PayPal configuration
const environment = new paypal.core.SandboxEnvironment('AVHbfkc-jrHlufxc43wGKkOHkIM5pPJTufgPvDo5MiyzeJqA1pSLf4k7lEAPGG1WLOw7y_A0D2kPXseW', 'EMqH6ePW-j_56S3FCvXg6W7_xbqwz6EQML-Ijf9HZeb2pT-aXbyVg6jUm-sBd2X59c6HnaUKSy-qTn3a');
const client = new paypal.core.PayPalHttpClient(environment);

app.get('/', (req, res) => {
    res.status(200).json({ message: "running" });
});

app.post('/create-order', async (req, res) => {
    const { amount } = req.body; // The amount is expected in USD cents

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: (amount / 100).toFixed(2), // Convert amount to dollars
            },
        }],
    });

    try {
        const order = await client.execute(request);
        res.json({ id: order.result.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/capture-order', async (req, res) => {
    const { orderID } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    try {
        const capture = await client.execute(request);
        res.json({ status: capture.result.status });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));