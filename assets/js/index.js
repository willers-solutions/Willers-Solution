document.querySelector('#register-btn').addEventListener('click', async function (e) {
  e.preventDefault();

    const formData = {
        surn_name: document.getElementById("surname").value.trim(),
        other_name: document.getElementById("otherNames").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        course: document.getElementById("skillHub").value,
        
        // Default values (you will override these after payment):
        amount_paid: 15000,
    };

  document.getElementById("register-btn").textContent = "Processing...";

  const button = document.getElementById('register-btn');

  // Disable by adding a class and preventing interaction
  button.classList.add('disabled');          // You can style this in CSS
  button.disabled = true;                   // Disable the button

  try {
    const response = await fetch("https://willers-solutions-backend.onrender.com/buy-course", {
      method: 'POST',
      credentials: 'include', // This ensures cookies (sessions/JWT) are sent
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
        button.textContent = "Pay ₦15,000 One-Time Fee";
        button.classList.remove('disabled');          // You can style this in CSS
        button.disabled = false;                   // Disable the button
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Payment initiation response:", data);
    document.getElementById("submitBooking").textContent = "Please wait...";
    localStorage.setItem("OrderID", String(data.course_id));
    window.location.href = data.success.data.authorization_url;

  } catch (error) {
        button.textContent = "Pay ₦15,000 One-Time Fee";
        button.classList.remove('disabled');          // You can style this in CSS
        button.disabled = false;                   // Disable the button
    return null;
  }
});