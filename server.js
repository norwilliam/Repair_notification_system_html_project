const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Report = require('./models/Report');
const inventoryRoutes = require('./routes/inventoryRoutes');
const inventoryController = require('./controllers/inventoryController');
const Inventory = require('./models/Inventory');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendNotificationEmail, sendNotificationEmail2 } = require('./controllers/email');
require('dotenv').config();

const authenticateToken = require('./middleware/authenticateToken');
const reportRoutes = require('./routes/report');

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/send-notification-email', async (req, res) => {
    try {
        sendNotificationEmail();
        res.status(200).send('Notification email sent');
    } catch (error) {
        res.status(500).json({ error: 'Failed to send notification email' });
    }
});

app.post('/send-notification-email2', async (req, res) => {
    try {
        sendNotificationEmail2();
        res.status(200).send('Notification email sent');
    } catch (error) {
        res.status(500).json({ error: 'Failed to send notification email' });
    }
});

app.get('/test-email', (req, res) => {
    sendNotificationEmail();
    res.send('Test email has been sent');
});

app.get('/dashboard', authenticateToken, (req, res) => {
    res.sendFile(__dirname + '/public/dashboard.html');
});

app.post('/register', async (req, res) => {
    const { name, surname, username, password, tel, role } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).send('ชื่อผู้ใช้นี้มีอยู่แล้ว');

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, surname, username, password: hashedPassword, tel, role });
        await user.save();

        res.status(201).send('ลงทะเบียนผู้ใช้สำเร็จ');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/index', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).send('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).send('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/inventory', async (req, res) => {
    try {
        const inventoryItems = await Inventory.find();
        res.json(inventoryItems);
    } catch (err) {
        console.error('Error retrieving inventory:', err);
        res.status(500).json({ error: 'Failed to retrieve inventory', details: err.message });
    }
});

app.use('/api/report', authenticateToken, reportRoutes);

app.use('/api/inventory', inventoryRoutes);

app.get('/api/inventory', inventoryController.getInventory);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('เชื่อมต่อ MongoDB สำเร็จ'))
    .catch(err => console.error('เชื่อมต่อ MongoDB ล้มเหลว', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`เซิร์ฟเวอร์กำลังทำงานบนพอร์ต ${PORT}`));
