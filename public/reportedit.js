document.getElementById('logout').addEventListener('click', () => {
    // ลบ token ออกจาก localStorage
    localStorage.removeItem('token');
    // เปลี่ยนเส้นทางไปที่หน้า login
    window.location.href = '/index.html';
});

document.getElementById('updateStatusForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // ป้องกันการส่งฟอร์มแบบปกติ

    const reportId = document.getElementById('reportId').value;
    const status = document.getElementById('status').value;

    const requestData = { status };

    try {
        const response = await fetch(`/api/report/${reportId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(requestData)
        });

        if (response.ok) {
            await fetch('/send-notification-email2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // ส่ง token ใน header
                }
            });
            alert('สถานะอัปเดตเรียบร้อยแล้ว');
            window.location.reload();
        } else {
            alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('backButton').addEventListener('click', () => {
        window.location.href = 'dashboard.html'; // เปลี่ยนเส้นทางไปที่หน้า dashboard
    });
});

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/report', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // เพิ่ม token ไปใน header
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data); // ตรวจสอบข้อมูลที่ได้รับจาก API
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // เรียงข้อมูลจากล่าสุดไปเก่าสุด (ตาม createdAt)
            const reportList = document.getElementById('reportList_2');
            if (data.length > 0) {
                data.forEach(report => {
                    const reportDiv = document.createElement('div');
                    reportDiv.classList.add('report-item');
                    reportDiv.innerHTML = `
                        <h3>${report.title}</h3>
                        <p><strong>ID:</strong> ${report._id}</p>
                        <p><strong>รายละเอียด:</strong> ${report.detail}</p>
                        <p><strong>สถานที่:</strong> ${report.location}</p>
                        <p><strong>สถานะ:</strong> ${report.status}</p>
                        <p><strong>วันที่แจ้งซ่อม:</strong> ${new Date(report.createdAt).toLocaleString()}</p>
                    `;
                    reportList.appendChild(reportDiv);
                });
            } else {
                reportList.innerHTML = '<p>ไม่มีรายงานในขณะนี้</p>';
            }
        })
        .catch(error => console.error('Error fetching reports:', error));
});
