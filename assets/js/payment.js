async function loadTransactionSummary() {
    // Get bookingID from the URL
    var bookingID = new URLSearchParams(window.location.search).get("OrderID");

    if (!bookingID) {
        // console.error("No OrderID found in URL");
        // return;
        bookingID = localStorage.getItem("OrderID");
    }

    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?OrderID=' + bookingID;
    history.pushState({ path: newUrl }, '', newUrl);

    try {
        // Make the request
        const response = await fetch(`https://nysc-api.willerssolutions.com/get-course-by-id/${bookingID}`);

        if (!response.ok) {
            throw new Error("Failed to fetch transaction details");
        }

        const data = await response.json();

        // Combine full name
        const fullName = `${data.success.other_name || ""} ${data.success.surn_name || ""}`.trim();

        sendEmailRequest(fullName, data.success.email, data.success.course, data.success.reference);

        // Render values
        document.getElementById("summary-name").textContent = fullName || "N/A";
        document.getElementById("summary-email").textContent = data.success.email || "N/A";
        document.getElementById("summary-phone").textContent = data.success.phone || "N/A";
        document.getElementById("summary-skill").textContent = data.success.course || "N/A";
        renderStatusBadge(data.success.payment_status);

        // Amount
        document.getElementById("summary-amount").textContent =
            `₦${Number(data.success.amount_paid).toLocaleString()}`;

        // Transaction ID
        document.getElementById("summary-tx").textContent =
            "WIL-"+data.success.ID || bookingID;

        // Date

        document.getElementById("summary-date").textContent = formatDate(data.success.CreatedAt);

    } catch (error) {
        console.error("Error loading course:", error);
    }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { day: "numeric", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-GB", options);
}

function renderStatusBadge(status) {
    const statusEl = document.getElementById("summary-status");

    if (!statusEl) return;

    const cleanStatus = status?.toLowerCase() || "";

    // Reset classes first
    statusEl.className = "font-bold px-3 py-1 rounded-lg text-white";

    if (cleanStatus === "successful" || cleanStatus === "success") {
        statusEl.textContent = "Successful";
        statusEl.classList.add("bg-green-500");
    } 
    else if (cleanStatus === "pending") {
        statusEl.textContent = "Pending";
        statusEl.classList.add("bg-yellow-500");
    } 
    else if (cleanStatus === "failed" || cleanStatus === "fail") {
        statusEl.textContent = "Failed";
        statusEl.classList.add("bg-red-500");
    } 
    else {
        statusEl.textContent = "Unknown";
        statusEl.classList.add("bg-gray-500");
    }
}

function sendEmailRequest(name, email, course, referenceID) {
    const baseURL = "https://api.abittoferry.com/send-email";

    // Encode values safely for URL
    const encodedName = encodeURIComponent(name);
    const encodedEmail = encodeURIComponent(email);
    const encodedCourse = encodeURIComponent(course);
    const encodedReference = encodeURIComponent(referenceID);

    const url = `${baseURL}/${encodedName}/${encodedEmail}/${encodedCourse}/${encodedReference}`;
    
    console.log("Sending GET request to:", url);

    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log("Response:", data);
            alert("Email sent successfully!");
        })
        .catch(err => {
            console.error("Error:", err);
            alert("Failed to send email.");
        });
}

// Auto-run when page loads
document.addEventListener("DOMContentLoaded", loadTransactionSummary);
