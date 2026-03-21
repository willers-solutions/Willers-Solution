async function loadTransactionSummary() {
    // Get bookingID from the URL or localStorage
    var bookingID = new URLSearchParams(window.location.search).get("OrderID");

    if (!bookingID) {
        bookingID = localStorage.getItem("OrderID");
    }

    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?OrderID=' + bookingID;
    history.pushState({ path: newUrl }, '', newUrl);

    try {
        const response = await fetch(`https://nysc-api.willerssolutions.com/get-course-by-id/${bookingID}`);

        if (!response.ok) {
            throw new Error("Failed to fetch transaction details");
        }

        const data = await response.json();
        const d = data.success;

        // Full name
        const fullName = `${d.other_name || ""} ${d.surn_name || ""}`.trim();

        // Basic fields
        document.getElementById("summary-name").textContent  = fullName || "N/A";
        document.getElementById("summary-email").textContent = d.email  || "N/A";
        document.getElementById("summary-phone").textContent = d.phone  || "N/A";
        document.getElementById("summary-skill").textContent = d.course || "N/A";
        document.getElementById("summary-tx").textContent    = "WIL-" + (d.ID || bookingID);
        document.getElementById("summary-date").textContent  = formatDate(d.CreatedAt);

        renderStatusBadge(d.payment_status);

        // ── Payment Tier & Installment Info ──────────────────────────────────
        const tier          = d.payment_tier       || "one-time";
        const totalDue      = d.total_amount_due   || 15000;
        const amountPaid    = d.amount_paid        || 0;
        const balance       = d.balance_remaining  !== undefined ? d.balance_remaining : (totalDue - amountPaid);
        const instStatus    = d.installment_status || (balance <= 0 ? "completed" : "in-progress");

        // Amount paid so far
        document.getElementById("summary-amount").textContent =
            `₦${Number(amountPaid).toLocaleString()}`;

        // Payment plan row
        const tierEl = document.getElementById("summary-tier");
        if (tierEl) {
            tierEl.textContent = tier === "installment" ? "Installment Plan (₦6,000 × 3 months)" : "One-Time Payment";
        }

        // Total due row
        const totalEl = document.getElementById("summary-total");
        if (totalEl) {
            totalEl.textContent = `₦${Number(totalDue).toLocaleString()}`;
        }

        // Balance remaining row (only show for installment)
        const balanceRow = document.getElementById("balance-row");
        const balanceEl  = document.getElementById("summary-balance");
        if (balanceRow && balanceEl) {
            if (tier === "installment") {
                balanceRow.classList.remove("hidden");
                balanceEl.textContent = `₦${Number(balance).toLocaleString()}`;
                balanceEl.className = balance > 0 ? "text-red-600 font-bold" : "text-green-600 font-bold";
            } else {
                balanceRow.classList.add("hidden");
            }
        }

        // Installment status badge
        const instRow = document.getElementById("installment-status-row");
        const instEl  = document.getElementById("summary-installment-status");
        if (instRow && instEl) {
            if (tier === "installment") {
                instRow.classList.remove("hidden");
                instEl.textContent  = instStatus === "completed" ? "Fully Paid" : "In Progress";
                instEl.className    = "font-bold px-3 py-1 rounded-lg text-white " +
                    (instStatus === "completed" ? "bg-green-500" : "bg-yellow-500");
            } else {
                instRow.classList.add("hidden");
            }
        }

        sendEmailRequest(fullName, d.email, d.course, d.reference);

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
    statusEl.className = "font-bold px-3 py-1 rounded-lg text-white";

    if (cleanStatus === "successful" || cleanStatus === "success") {
        statusEl.textContent = "Successful";
        statusEl.classList.add("bg-green-500");
    } else if (cleanStatus === "partial") {
        statusEl.textContent = "Partial Payment";
        statusEl.classList.add("bg-blue-500");
    } else if (cleanStatus === "pending") {
        statusEl.textContent = "Pending";
        statusEl.classList.add("bg-yellow-500");
    } else if (cleanStatus === "failed" || cleanStatus === "fail") {
        statusEl.textContent = "Failed";
        statusEl.classList.add("bg-red-500");
    } else {
        statusEl.textContent = "Unknown";
        statusEl.classList.add("bg-gray-500");
    }
}

function sendEmailRequest(name, email, course, referenceID) {
    const baseURL = "https://api.abittoferry.com/send-email";
    const url = `${baseURL}/${encodeURIComponent(name)}/${encodeURIComponent(email)}/${encodeURIComponent(course)}/${encodeURIComponent(referenceID)}`;

    fetch(url, { method: "GET", headers: { "Accept": "application/json" } })
        .then(async res => {
            if (!res.ok) { const text = await res.text(); throw new Error(text); }
            return res.json();
        })
        .then(data => console.log("Email response:", data))
        .catch(err => console.error("Email error:", err));
}

document.addEventListener("DOMContentLoaded", loadTransactionSummary);
