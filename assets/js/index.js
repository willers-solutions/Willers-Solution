document.querySelector('#register-btn').addEventListener('click', async function (e) {
    e.preventDefault();

    const formData = {
        surn_name: document.getElementById("surname").value.trim(),
        other_name: document.getElementById("otherNames").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        course: document.getElementById("skillHub").value,
        amount_paid: 15000,
    };

    const button = document.getElementById('register-btn');
    button.textContent = "Processing...";
    button.disabled = true;
    button.classList.add('opacity-50', 'cursor-not-allowed');

    try {
        const response = await fetch("https://willers-solutions-backend.onrender.com/buy-course", {
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

        // Save the course ID
        localStorage.setItem("OrderID", String(data.course_id));

        // Redirect to Paystack
        window.location.href = data.success.data.authorization_url;

    } catch (error) {
        console.error(error);

        // Restore button so user can try again
        button.textContent = "Pay ₦15,000 One-Time Fee";
        button.disabled = false;
        button.classList.remove('opacity-50', 'cursor-not-allowed');
    }
});
