document.getElementById("courseSelector").addEventListener("change", async function() {
    const selectedCourse = this.value;
    if (!selectedCourse || selectedCourse === "all") {
        resetUI();
        return;
    }

    try {
        // Fetch course users & CSV
        const response = await fetch(`https://nysc-api.willerssolutions.com/download-course-csv/${encodeURIComponent(selectedCourse)}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: 'include', // set credentials to include cookies
        });
        const result = await response.json();

        if (result.count === 0) {
            document.getElementById("courseData").textContent = "No students found for this course.";
        } else {
            // Render Students Table
            renderStudents(result.users);
        }

        // Show Stats
        document.getElementById("courseStats").style.display = "flex";
        document.getElementById("totalStudents").textContent = result.count;
        
        let totalPay = 0;
        result.users.forEach(u => totalPay += u.amount_paid);
        document.getElementById("totalRevenue").textContent = "₦" + totalPay.toLocaleString();

        // Enable email button
        document.getElementById("sendEmailBtn").disabled = false;

        // Save CSV data temporarily
        window.currentCSV = result.csv;

        // Show CSV download button
        document.getElementById("downloadCsvBtn").classList.remove("d-none");

    } catch (err) {
        console.error(err);
        resetUI();
    }
});

// 🎯 Helper to Render Students
function renderStudents(users) {
    const tbody = document.getElementById("studentsTable");
    tbody.innerHTML = "";
    users.forEach((u, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${u.surn_name} ${u.other_name}</td>
                <td>${u.email}</td>
                <td>${u.phone}</td>
                <td>₦${u.amount_paid.toLocaleString()}</td>
            </tr>
        `;
    });
}

// 🧹 Reset UI When No Course Selected
function resetUI() {
    document.getElementById("courseStats").style.display = "none";
    document.getElementById("studentsTable").innerHTML = `<tr><td colspan="5" class="text-center text-muted">Select a course to load data...</td></tr>`;
    // document.getElementById("sendEmailBtn").disabled = true;
    document.getElementById("downloadCsvBtn").classList.add("d-none");
    window.currentCSV = null;
}

// 📥 Trigger CSV Download
document.getElementById("downloadCsvBtn").addEventListener("click", () => {
    if (!window.currentCSV) return;
    const a = document.createElement("a");
    a.href = "data:text/csv;base64," + window.currentCSV;
    a.download = "course_users.csv";
    a.click();
});

// document.getElementById("sendEmailBtn").addEventListener("click", async () => {
//     const course = document.getElementById("courseSelector").value;
//     const message = document.getElementById("emailMessage").value.trim();

//     if (!message) return alert("Email message cannot be empty!");

//     const res = await fetch(`https://nysc-api.willerssolutions.com/send-email-course`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ course, message })
//     });

//     const response = await res.json();
//     alert(response.message);
// });


document.addEventListener("DOMContentLoaded", () => {
    const targetType = document.getElementById("emailTargetType");
    const testEmailInput = document.getElementById("testEmailInput");
    const courseSelector = document.getElementById("courseSelector");
    // const sendBtn = document.getElementById("sendEmailBtn");

    const subjectInput = document.getElementById("emailSubject");
    const messageInput = document.getElementById("emailMessage");

    function updateButtonState() {
        const subject = subjectInput.value.trim();
        const message = messageInput.value.trim();
        const target = targetType.value;

        let canSend = subject !== "" && message !== "" && target !== "";

        if (target === "test") {
            canSend = canSend && testEmailInput.value.trim() !== "";
        } else if (target === "course") {
            canSend = canSend && courseSelector.value !== "";
        }

        sendBtn.disabled = !canSend;
    }

    targetType.addEventListener("change", () => {
        if (targetType.value === "test") {
            testEmailInput.classList.remove("d-none");
            courseSelector.classList.add("d-none");
        } else if (targetType.value === "course") {
            courseSelector.classList.remove("d-none");
            testEmailInput.classList.add("d-none");
        } else {
            testEmailInput.classList.add("d-none");
            courseSelector.classList.add("d-none");
        }

        updateButtonState();
    });

    [subjectInput, messageInput, testEmailInput, courseSelector].forEach(el => {
        el.addEventListener("input", updateButtonState);
    });

    sendBtn.addEventListener("click", () => {
        sendBtn.disabled = true;
        sendBtn.innerText = "Sending...";

        const payload = {
            subject: subjectInput.value.trim(),
            message: messageInput.value.trim(),
            type: targetType.value,
            testEmail: targetType.value === "test" ? testEmailInput.value.trim() : null,
            course: targetType.value === "course" ? courseSelector.value : null,
        };

        fetch("YOUR_API_URL_HERE/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message || "Email sent successfully!");
            sendBtn.innerText = "Send Email";
            sendBtn.disabled = false;
        })
        .catch(err => {
            alert("Failed to send email.");
            console.error(err);
            sendBtn.innerText = "Send Email";
            sendBtn.disabled = false;
        });
    });
});
