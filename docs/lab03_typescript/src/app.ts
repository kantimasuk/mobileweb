import { Student } from "./models/Student.js";
import { StudentManager } from "./managers/StudentManager.js";
import { showList } from "./utils/showList.js";

const manager = new StudentManager();
manager.loadFromLocalStorage();

// ฟังก์ชันแสดงตาราง
function renderTable(elementId: string = "studentTableBody"): void {
  const tableBody = document.getElementById(elementId)!;
  tableBody.innerHTML = "";

  const students = manager.getAllStudents();
  showList<Student>(students);

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
(document.getElementById("addBtn") as HTMLButtonElement).onclick = () => {
  const id = (document.getElementById("id") as HTMLInputElement).value;
  const title_name = (document.getElementById("title_name") as HTMLInputElement).value;
  const first_name = (document.getElementById("first_name") as HTMLInputElement).value;
  const last_name = (document.getElementById("last_name") as HTMLInputElement).value;
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const year = Number((document.getElementById("year") as HTMLInputElement).value);
  const major = (document.getElementById("major") as HTMLInputElement).value;

  if (!id || !first_name || !last_name) {
    alert("กรุณากรอก รหัสนักศึกษา ชื่อ และนามสกุล ให้ครบ");
    return;
  }

  // ✅ เพิ่ม title_name, first_name, last_name, email ให้ครบ
  const student: Student = {
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
  (document.getElementById("id") as HTMLInputElement).value = "";
  (document.getElementById("title_name") as HTMLInputElement).value = "";
  (document.getElementById("first_name") as HTMLInputElement).value = "";
  (document.getElementById("last_name") as HTMLInputElement).value = "";
  (document.getElementById("email") as HTMLInputElement).value = "";
  (document.getElementById("year") as HTMLInputElement).value = "";
  (document.getElementById("major") as HTMLInputElement).value = "";
};

// 🔍 ค้นหาด้วยชื่อ (first_name / last_name)
(document.getElementById("searchNameBtn") as HTMLButtonElement).onclick = () => {
  const keyword = (document.getElementById("searchName") as HTMLInputElement).value;
  const results = manager.findStudentsByName(keyword);
  showList<Student>(results);
  alert(`ผลการค้นหา: ${results.length} คน`);
};

// 🔍 ค้นหาด้วยสาขา
(document.getElementById("searchMajorBtn") as HTMLButtonElement).onclick = () => {
  const keyword = (document.getElementById("searchMajor") as HTMLInputElement).value;
  const results = manager.findStudentsByMajor(keyword);
  showList<Student>(results);
  alert(`พบในสาขา: ${results.length} คน`);
};

// 🔍 เพิ่มค้นหาด้วย Email
(document.getElementById("searchEmailBtn") as HTMLButtonElement).onclick = () => {
  const email = (document.getElementById("searchEmail") as HTMLInputElement).value;
  const student = manager.findStudentByEmail(email);

  if (student) {
    showList<Student>([student]);
    alert(
      `พบข้อมูลนักศึกษา:\n${student.title_name}${student.first_name} ${student.last_name}\nEmail: ${student.email}`
    );
  } else {
    alert("ไม่พบนักศึกษาที่มี Email นี้");
  }
};

renderTable("studentTableBody");
