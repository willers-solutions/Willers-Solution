document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('loginButton1');
    const btnText = document.getElementById('btnText');
    const loader = document.getElementById('loader');
    const errorMsg = document.getElementById('errorMsg');

    loginButton.addEventListener('click', function (event) {
        event.preventDefault();

        const loginEmail = document.getElementById('user').value.trim();
        const loginPassword = document.getElementById('password').value.trim();

        // VALIDATION
        if (!loginEmail || !isValidEmail(loginEmail)) {
            showError("Please enter a valid email address.");
            return;
        }

        if (!loginPassword) {
            showError("Please enter your password.");
            return;
        }

        // SHOW LOADING
        toggleLoading(true);

        fetch('https://nysc-api.willerssolutions.com/sign-in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email: loginEmail, password: loginPassword })
        })
        .then(response => response.json())
        .then(data => {
            toggleLoading(false);

            if (data.success) {
                localStorage.setItem('auth', 'true');
                window.location.href = data.dashboard;
            } else {
                showError(data.message || "Invalid email or password.");
            }
        })
        .catch(error => {
            toggleLoading(false);
            showError("Server error, try again later.");
            console.error('Error:', error);
        });

    });

    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
    }

    function toggleLoading(isLoading) {
        if (isLoading) {
            btnText.classList.add("d-none");
            loader.classList.remove("d-none");
            loginButton.disabled = true;
        } else {
            btnText.classList.remove("d-none");
            loader.classList.add("d-none");
            loginButton.disabled = false;
        }
    }
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
