document.querySelector('#register-btn').addEventListener('click', async function (e) {
    e.preventDefault();

    const referralSource = document.getElementById("referralSource").value;
    const otherReferral = document.getElementById("otherReferral").value.trim();

    const formData = {
        surn_name: document.getElementById("surname").value.trim(),
        other_name: document.getElementById("otherNames").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        course: document.getElementById("skillHub").value,
        referral_source: referralSource,
        referral_other: referralSource === "Others" ? otherReferral : null,
        amount_paid: 15000,
    };

    const button = document.getElementById('register-btn');
    button.textContent = "Processing...";
    button.disabled = true;
    button.classList.add('opacity-50', 'cursor-not-allowed');

    try {
        const response = await fetch("https://nysc-api.willerssolutions.com/buy-course", {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error("Request failed with " + response.status);
        }

        const data = await response.json();

        localStorage.setItem("OrderID", String(data.course_id));
        window.location.href = data.success.data.authorization_url;

    } catch (error) {
        console.error(error);
        button.textContent = "Pay ₦15,000 One-Time Fee";
        button.disabled = false;
        button.classList.remove('opacity-50', 'cursor-not-allowed');
    }
});

const referralSelect = document.getElementById('referralSource');
const otherReferralInput = document.getElementById('otherReferral');

referralSelect.addEventListener('change', function () {
    if (this.value === 'Others') {
        otherReferralInput.classList.remove('hidden');
        otherReferralInput.required = true;
    } else {
        otherReferralInput.classList.add('hidden');
        otherReferralInput.required = false;
        otherReferralInput.value = '';
    }
});

document.addEventListener("DOMContentLoaded", function () {

  const images = [
    "hero-1.png",
    "hero-2.png",
    "hero-3.png",
    "hero-4.png"
  ];

  const heroImage = document.getElementById("heroImage");
  let index = 0;

  setInterval(() => {

    // Fade out
    heroImage.classList.remove("opacity-100");
    heroImage.classList.add("opacity-0");

    setTimeout(() => {
      // Change image
      index = (index + 1) % images.length;
      heroImage.src = images[index];

      // Fade in
      heroImage.classList.remove("opacity-0");
      heroImage.classList.add("opacity-100");

    }, 500); // Half of transition duration

  }, 3000); // Change every 3 seconds

});

// const loanInput = document.getElementById("loanAmount");
// const MAX_LOAN = 500000;

// loanInput.addEventListener("input", function () {
//     let value = parseInt(loanInput.value, 10);

//     if (value < 0) {
//         loanInput.value = 0;
//     }

//     if (value > MAX_LOAN) {
//         loanInput.value = MAX_LOAN;
//         alert("Maximum loan amount allowed is ₦500,000");
//     }
// });

// document.getElementById("loan-form").addEventListener("submit", async function (e) {
//     e.preventDefault(); // stop page reload

//     const messageBox = document.getElementById("loan-message");
//     messageBox.classList.remove("hidden");
//     messageBox.textContent = "Submitting your application...";
//     messageBox.style.color = "#333";

//     // Collect form data
//     const loanData = {
//         fullName: document.getElementById("fullName").value.trim(),
//         otherNames: document.getElementById("referenceCode").value.trim(),
//         email: document.getElementById("email").value.trim(),
//         phone: document.getElementById("phone").value.trim(),
//         loanAmount: document.getElementById("loanAmount").value.trim(),
//     };

//     try {
//         const response = await fetch("https://nysc-api.willerssolutions.com/loan-apply", {
//             method: "POST",
//             headers: {"Content-Type": "application/json"},
//             body: JSON.stringify(loanData),
//         });

//         const result = await response.json();

//         if (response.ok) {
//             messageBox.textContent = "Your loan application has been submitted successfully!";
//             messageBox.style.color = "green";
//             document.getElementById("loan-form").reset();
//         } else {
//             messageBox.textContent = result.message || "Error: Unable to submit your application.";
//             messageBox.style.color = "red";
//         }
//     } catch (error) {
//         messageBox.textContent = "Network error! Please try again.";
//         messageBox.style.color = "red";
//     }
// });