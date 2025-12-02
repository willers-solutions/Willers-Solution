async function loadTransactionSummary() {
    // Get bookingID from the URL
    const bookingID = new URLSearchParams(window.location.search).get("OrderID");

    if (!bookingID) {
        const orderIdLoc = localStorage.getItem("OrderID");

        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?OrderID=' + orderIdLoc;
        history.pushState({ path: newUrl }, '', newUrl);
    }

    try {
        // Make the request
        const response = await fetch(`https://willers-solutions-backend.onrender.com/get-course-by-id/${orderIdLoc}`);

        if (!response.ok) {
            throw new Error("Failed to fetch transaction details");
        }

        const data = await response.json();

        // Combine full name
        const fullName = `${data.other_name || ""} ${data.surn_name || ""}`.trim();

        // Render values
        document.getElementById("summary-name").textContent = fullName || "N/A";
        document.getElementById("summary-email").textContent = data.email || "N/A";
        document.getElementById("summary-phone").textContent = data.phone || "N/A";
        document.getElementById("summary-skill").textContent = data.course || "N/A";
        renderStatusBadge(data.payment_status);

        // Amount
        document.getElementById("summary-amount").textContent =
            `₦${Number(data.amount_paid).toLocaleString()}`;

        // Transaction ID
        document.getElementById("summary-tx").textContent =
            data.transaction_id || bookingID;

        // Date
        const formattedDate = data.date
            ? new Date(data.date).toLocaleDateString("en-NG", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            })
            : "N/A";

        document.getElementById("summary-date").textContent = formattedDate;

    } catch (error) {
        console.error("Error loading course:", error);
    }
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

// Auto-run when page loads
document.addEventListener("DOMContentLoaded", loadTransactionSummary);
