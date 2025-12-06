const data = {
  "success": [
    {
      "ID": 3189,
      "user_name": "Chinonso Alexander",
      "transaction_id": 9981994334,
      "transaction_status": "success",
      "created_at": "2025-10-28T19:50:40.857Z",
      "service_type": "e-Shop Subscription",
      "amount": 0,
      "channel_type": "Wallet"
    },
    {
      "ID": 3169,
      "user_name": "Chinonso Alexander",
      "transaction_id": 9004593690,
      "transaction_status": "failed",
      "created_at": "2025-09-27T17:24:52.463Z",
      "service_type": "data",
      "amount": 1470,
      "channel_type": "Wallet"
    },
    {
      "ID": 3190,
      "user_name": "Precious Okafor",
      "transaction_id": 2345678910,
      "transaction_status": "pending",
      "created_at": "2025-10-15T09:22:11.000Z",
      "service_type": "Airtime",
      "amount": 1500,
      "channel_type": "Card"
    },
    {
      "ID": 3191,
      "user_name": "Ibrahim Yusuf",
      "transaction_id": 8765432109,
      "transaction_status": "success",
      "created_at": "2025-10-10T13:11:03.000Z",
      "service_type": "Data Bundle",
      "amount": 2500,
      "channel_type": "Wallet"
    },
    {
      "ID": 3192,
      "user_name": "Sandra Obi",
      "transaction_id": 5556677889,
      "transaction_status": "failed",
      "created_at": "2025-09-19T18:35:42.000Z",
      "service_type": "Cable TV Subscription",
      "amount": 8200,
      "channel_type": "Card"
    },
    {
      "ID": 3193,
      "user_name": "Emeka Johnson",
      "transaction_id": 1112233445,
      "transaction_status": "success",
      "created_at": "2025-09-25T11:45:20.000Z",
      "service_type": "Electricity Bill",
      "amount": 12600,
      "channel_type": "Bank Transfer"
    },
    {
      "ID": 3194,
      "user_name": "Faith Adebayo",
      "transaction_id": 2233445566,
      "transaction_status": "success",
      "created_at": "2025-10-02T16:12:55.000Z",
      "service_type": "Data",
      "amount": 1000,
      "channel_type": "Wallet"
    },
    {
      "ID": 3195,
      "user_name": "John Paul",
      "transaction_id": 4455667788,
      "transaction_status": "failed",
      "created_at": "2025-08-22T20:18:30.000Z",
      "service_type": "Airtime",
      "amount": 700,
      "channel_type": "Wallet"
    },
    {
      "ID": 3196,
      "user_name": "Tolu Akinyemi",
      "transaction_id": 6677889900,
      "transaction_status": "success",
      "created_at": "2025-10-26T07:55:12.000Z",
      "service_type": "Money Transfer",
      "amount": 35000,
      "channel_type": "Bank Transfer"
    },
    {
      "ID": 3197,
      "user_name": "Blessing Uche",
      "transaction_id": 8899001122,
      "transaction_status": "pending",
      "created_at": "2025-10-28T09:48:44.000Z",
      "service_type": "Cable TV",
      "amount": 5400,
      "channel_type": "Card"
    },
    {
      "ID": 3198,
      "user_name": "Stanley Obi",
      "transaction_id": 1122334455,
      "transaction_status": "success",
      "created_at": "2025-10-25T14:37:05.000Z",
      "service_type": "Internet Subscription",
      "amount": 7500,
      "channel_type": "Wallet"
    }
  ]
};

var NextPageOnLoad;
var PreviousPageOnLoad;
var CurrentPageOnLoad;
var TotalPageOnLoad;
var TwoBeforePageOnLoad;
var TwoAfterPageOnLoad;
var ThreeAfterPageOnLoad;
var AllRecordsOnPageLoad;

document.addEventListener('DOMContentLoaded', async function () {
    await loadTransactions();
    const dropdown = document.getElementById('courseDropdown');
    
    dropdown.addEventListener('click', function(e) {
        if (e.target.classList.contains('dropdown-item')) {
            e.preventDefault();
            const selectedCourse = e.target.textContent.trim();
            
            // Call your search/pagination with course filter
            loadTransactions(1, selectedCourse);

            // Optional: update button text to show selected filter
            document.querySelector('.dropdown-toggle').textContent = selectedCourse;
        }
    });
});

async function loadTransactions(pageNumber, courseFilter) {
    // Clear the table and show skeleton loader
    renderTransactionHistoryLoading();

    if (!courseFilter) {
        courseFilter = "all";
        // console.log("Filtering by course:", courseFilter);
    }

    // Get current page from params or default to 1
    const currentUrl = new URL(window.location.href);
    const params = new URLSearchParams(currentUrl.search);
    if (!pageNumber) pageNumber = params.get("page") || "1";

    const apiUrl = "https://willers-solutions-backend.onrender.com/get-courses/" + pageNumber + "/10";

    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
    };

    try {
        const response = await fetch(apiUrl, requestOptions);
        const responseData = await response.json();

        if (!response.ok) {
            if (responseData.error === "No Authentication cookie found" || responseData.error === "Unauthorized attempt! JWT's not valid!" || responseData.error === "No Refresh cookie found") {
                logUserOutIfTokenIsExpired();
            }
            return;
        }

        renderTransactions(responseData.data);
        renderPagination(responseData.pagination);
    } catch (error) {
        console.error("Error loading transactions:", error);
    }
}

function renderTransactions(data) {
    const tableBody = document.getElementById("transactionTableBody");
    tableBody.innerHTML = "";

    if (!data || data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="10" class="text-center text-muted py-4">No transactions found</td></tr>`;
        return;
    }

    data.forEach((txn, index) => {
        const statusMap = {
            success: { text: "Completed", color: "success" },
            failed: { text: "Failed", color: "danger" },
            pending: { text: "Pending", color: "warning" }
        };

        const statusInfo = statusMap[txn.payment_status] || { text: txn.payment_status, color: "secondary" };
        // if (txn.service_type = "fundWallet") {
        //     txn.service_type = "Save Donation"
        // }

        // if (txn.channel_type = "bank_transfer") {
        //     txn.channel_type = "Bank Transfer"
        // }

        const row = `
            <tr>
                <td>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="check${index}">
                        <label class="form-check-label" for="check${index}">&nbsp;</label>
                    </div>
                </td>
                <td><a href="#!" class="link-primary fw-semibold" data-bs-toggle="modal" data-bs-target="#TransactionsViewModal">TXN-${txn.ID}</a></td>
                <td>${txn.other_name + " " + txn.surn_name}</td>
                <td>${new Date(txn.CreatedAt).toLocaleDateString()}</td>
                <td>₦${txn.amount_paid.toLocaleString()}</td>
                <td>
                    <a href="https://wa.me/${txn.phone.replace(/^0/, "234")}" target="_blank" class="text-green-600 hover:underline">
                        ${txn.phone}
                    </a>
                </td>
                <td>${txn.email}</td>
                <td>${txn.course}</td>
                <td><span class="badge bg-${statusInfo.color}-subtle text-${statusInfo.color} py-1 px-2 fs-12">${statusInfo.text}</span></td>
                <td>
                    <div class="d-flex gap-2">
                        <a href="#!" class="btn btn-light btn-sm"><iconify-icon icon="solar:eye-broken" class="align-middle fs-18"></iconify-icon></a>
                    </div>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);
    });
}

function renderTransactionHistoryLoading() {
    const tableBody = document.querySelector("#transactionTableBody");
    if (!tableBody) return;

    let skeletonHTML = "";
    for (let i = 0; i < 6; i++) {
        skeletonHTML += `
            <tr class="skeleton-row">
                <td colspan="10">
                    <div class="skeleton-line" style="width: 100%; height: 40px; border-radius: 8px;"></div>
                </td>
            </tr>
        `;
    }
    tableBody.innerHTML = skeletonHTML;
}

function renderPagination(pagination) {
    const paginationContainer = document.querySelector(".pagination");
    if (!paginationContainer) return;

    const CurrentPage = pagination.CurrentPage;
    const TotalPages = pagination.TotalPages;

    const PreviousPage = pagination.PreviousPage;
    const NextPage = pagination.NextPage;

    let paginationHTML = "";

    // Previous
    paginationHTML += `
        <li class="page-item ${PreviousPage < 1 ? "disabled" : ""}">
            <a class="page-link" href="javascript:void(0);" onclick="goToPage(${PreviousPage})">Previous</a>
        </li>
    `;

    // Page numbers
    for (let i = 1; i <= TotalPages; i++) {
        paginationHTML += `
            <li class="page-item ${i === CurrentPage ? "active" : ""}">
                <a class="page-link" href="javascript:void(0);" onclick="goToPage(${i})">${i}</a>
            </li>
        `;
    }

    // Next
    paginationHTML += `
        <li class="page-item ${NextPage > TotalPages ? "disabled" : ""}">
            <a class="page-link" href="javascript:void(0);" onclick="goToPage(${NextPage})">Next</a>
        </li>
    `;

    paginationContainer.innerHTML = paginationHTML;
}

function goToPage(page) {
    if (page <= 0) return;
    const url = new URL(window.location.href);
    url.searchParams.set("page", page);
    window.history.pushState({}, "", url);
    loadTransactions(page);
}

