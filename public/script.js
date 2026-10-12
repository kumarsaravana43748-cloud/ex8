function showMessage(text, type) {
    const box = document.getElementById('message');
    box.textContent = text;
    box.className = 'message ' + type;
}
async function sendRequest(url, method, body) {
    const options = { method: method, headers: {} };
    if (body) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Request failed');
    }
    return data;
}
async function loadStudents() {
    const students = await sendRequest('/api/students', 'GET');
    const table = document.getElementById('studentTable');
    table.innerHTML = '';
    if (students.length === 0) {
        table.innerHTML = '<tr><td colspan="4">No students registered.</td></tr>';
        return;
    }
    students.forEach(function (student) {
        const statusText = student.present ? 'Present' : 'Absent';
        const statusClass = student.present ? 'status-present' : 'status-absent';
        const row = document.createElement('tr');
        row.innerHTML =
            '<td>' + student.id + '</td>' +
            '<td></td>' +
            '<td class="' + statusClass + '">' + statusText + '</td>' +
            '<td>' +
                '<button class="btn present-btn" onclick="markPresent(' + student.id + ')">Mark Present</button>' +
                '<button class="btn absent-btn" onclick="markAbsent(' + student.id + ')">Mark Absent</button>' +
            '</td>';
        // textContent keeps the name safe from HTML injection
        row.children[1].textContent = student.name;
        table.appendChild(row);
    });
}
async function loadAttendance() {
    const data = await sendRequest('/api/attendance', 'GET');
    document.getElementById('totalCount').textContent = data.totalStudents;
    document.getElementById('presentCount').textContent = data.present;
    document.getElementById('absentCount').textContent = data.absent;
    document.getElementById('percentage').textContent = data.percentage.toFixed(2) + '%';
}
async function refreshDashboard() {
    await loadStudents();
    await loadAttendance();
}
async function markPresent(id) {
    try {
        const result = await sendRequest('/api/attendance/' + id, 'POST');
        await refreshDashboard();
        showMessage(result.message, 'success');
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}
async function markAbsent(id) {
    try {
        const result = await sendRequest('/api/attendance/' + id, 'DELETE');
        await refreshDashboard();
        showMessage(result.message, 'success');
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}
async function addStudent() {
    const input = document.getElementById('studentName');
    const name = input.value;
    if (name.trim() === '') {
        showMessage('Error: Student name cannot be empty', 'error');
        return;
    }
    try {
        const student = await sendRequest('/api/students', 'POST', { name: name });
        input.value = '';
        await refreshDashboard();
        showMessage(student.name + ' added successfully', 'success');
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}
document.getElementById('studentName').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        addStudent();
    }
});
refreshDashboard().catch(function (error) {
    showMessage('Error: Could not load data (' + error.message + ')', 'error');
});