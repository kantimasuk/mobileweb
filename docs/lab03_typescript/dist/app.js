import { StudentManager } from "./managers/StudentManager.js";
import { showList } from "./utils/showList.js";
const manager = new StudentManager();
manager.loadFromLocalStorage();
// ฟังก์ชันแสดงตาราง
function renderTable(elementId = "studentTableBody") {
    const tableBody = document.getElementById(elementId);
    tableBody.innerHTML = "";
    const students = manager.getAllStudents();
    showList(students);
    students.forEach((s) => {
        tableBody.innerHTML += `
      <tr>
        <td>${s.id}</td>
        <td>${s.title_name}</td>
        <td>${s.first_name}</td>
        <td>${s.last_name}</td>
        <td>${s.email}</td>
        <td>${s.year}</td>
        <td>${s.major}</td>
      </tr>
    `;
    });
}
// 🎯 เพิ่มนักศึกษา
document.getElementById("addBtn").onclick = () => {
    const id = document.getElementById("id").value;
    const title_name = document.getElementById("title_name").value;
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const email = document.getElementById("email").value;
    const year = Number(document.getElementById("year").value);
    const major = document.getElementById("major").value;
    if (!id || !first_name || !last_name) {
        alert("กรุณากรอก รหัสนักศึกษา ชื่อ และนามสกุล ให้ครบ");
        return;
    }
    // ✅ เพิ่ม title_name, first_name, last_name, email ให้ครบ
    const student = {
        id,
        title_name,
        first_name,
        last_name,
        email,
        year,
        major
    };
    manager.addStudent(student);
    renderTable();
    // ล้างค่า input
    document.getElementById("id").value = "";
    document.getElementById("title_name").value = "";
    document.getElementById("first_name").value = "";
    document.getElementById("last_name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("year").value = "";
    document.getElementById("major").value = "";
};
// 🔍 ค้นหาด้วยชื่อ (first_name / last_name)
document.getElementById("searchNameBtn").onclick = () => {
    const keyword = document.getElementById("searchName").value;
    const results = manager.findStudentsByName(keyword);
    showList(results);
    alert(`ผลการค้นหา: ${results.length} คน`);
};
// 🔍 ค้นหาด้วยสาขา
document.getElementById("searchMajorBtn").onclick = () => {
    const keyword = document.getElementById("searchMajor").value;
    const results = manager.findStudentsByMajor(keyword);
    showList(results);
    alert(`พบในสาขา: ${results.length} คน`);
};
// 🔍 เพิ่มค้นหาด้วย Email
document.getElementById("searchEmailBtn").onclick = () => {
    const email = document.getElementById("searchEmail").value;
    const student = manager.findStudentByEmail(email);
    if (student) {
        showList([student]);
        alert(`พบข้อมูลนักศึกษา:\n${student.title_name}${student.first_name} ${student.last_name}\nEmail: ${student.email}`);
    }
    else {
        alert("ไม่พบนักศึกษาที่มี Email นี้");
    }
};
renderTable("studentTableBody");
