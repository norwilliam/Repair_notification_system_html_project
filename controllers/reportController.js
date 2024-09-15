const Report = require('../models/Report');
const { sendNotificationEmail } = require('../controllers/inventoryController'); // นำเข้าฟังก์ชันจาก emailUtils

exports.createReport = async (req, res) => {
    const { title, detail, location, status } = req.body;
    try {
        const report = new Report({ title, detail, location, status });
        await report.save();
        sendNotificationEmail(); // ส่งอีเมลเมื่อสร้างรายงานใหม่
        res.status(201).json(report);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateReportStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const report = await Report.findByIdAndUpdate(id, { status }, { new: true });
        if (!report) return res.status(404).json({ error: 'Report not found' });
        res.json(report);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
