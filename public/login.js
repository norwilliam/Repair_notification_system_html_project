// login.js
document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/index', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) throw new Error('มีข้อผิดพลาดในการตอบสนองของเครือข่าย');

        const result = await response.json();
        localStorage.setItem('token', result.token); // เก็บ token

        // ตรวจสอบ role และเปลี่ยนเส้นทางตาม role
        if (result.role === 'Technician') {
            alert('เข้าสู่ระบบในส่วนเจ้าหน้าที่ผู้ปฎิบัติงาน');
            window.location.href = '/reportedit.html';
        } else if (result.role === 'Informer') {
            alert('เข้าสู่ระบบในส่วนผู้ใช้งานทั่วไป');
            window.location.href = '/dashboard.html';
        } else {
            alert('เข้าสู่ระบบไม่สำเร็จ');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Username หรือ Password ไม่ถูกต้อง \nโปรดลองใหม่อีกครั้ง');
    }
});
