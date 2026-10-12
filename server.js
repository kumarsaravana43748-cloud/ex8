const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.static('public'));
let students = [
    { id: 1, name: "Arun", present: false },
    { id: 2, name: "Priya", present: false },
    { id: 3, name: "Rahul", present: false }
];
function findStudent(idText) {
    if (!/^\d+$/.test(idText)) {
        return { error: "Invalid student ID", status: 400 };
    }
    const student = students.find(function (s) {
        return s.id === Number(idText);
    });
    if (!student) {
        return { error: "Student not found", status: 404 };
    }
    return { student: student };
}
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/api/students', function (req, res) {
    res.status(200).json(students);
});
app.post('/api/students', function (req, res) {
    const name = req.body && typeof req.body.name === 'string'
        ? req.body.name.trim()
        : '';
    if (name === '') {
        return res.status(400).json({ error: "Student name cannot be empty" });
    }
    let newId = 1;
    if (students.length > 0) {
        newId = Math.max(...students.map(function (s) { return s.id; })) + 1;
    }
    const newStudent = { id: newId, name: name, present: false };
    students.push(newStudent);
    res.status(201).json(newStudent);
});
app.post('/api/attendance/:id', function (req, res) {
    const result = findStudent(req.params.id);
    if (result.error) {
        return res.status(result.status).json({ error: result.error });
    }
    result.student.present = true;
    res.status(200).json({
        message: result.student.name + " marked present",
        student: result.student
    });
});
app.delete('/api/attendance/:id', function (req, res) {
    const result = findStudent(req.params.id);
    if (result.error) {
        return res.status(result.status).json({ error: result.error });
    }
    result.student.present = false;
    res.status(200).json({
        message: result.student.name + " marked absent",
        student: result.student
    });
});
app.get('/api/attendance', function (req, res) {
    const totalStudents = students.length;
    const present = students.filter(function (s) { return s.present; }).length;
    const absent = totalStudents - present;
    let percentage = 0;
    if (totalStudents > 0) {
        percentage = Number(((present / totalStudents) * 100).toFixed(2));
    }
    res.status(200).json({
        totalStudents: totalStudents,
        present: present,
        absent: absent,
        percentage: percentage,
        students: students
    });
});
app.use(function (err, req, res, next) {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: "Invalid JSON in request" });
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
});
app.listen(PORT, function () {
    console.log("Attendance System running at http://localhost:" + PORT);
});
