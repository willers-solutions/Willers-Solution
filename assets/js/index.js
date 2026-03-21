// ─── Payment Plan Selection ───────────────────────────────────────────────────
let selectedPaymentPlan = null; // 'one-time' or 'installment'

function selectPaymentPlan(plan) {
    selectedPaymentPlan = plan;

    // Reset both card borders
    document.getElementById('plan-onetime').classList.remove('border-green-500', 'ring-2', 'ring-green-400');
    document.getElementById('plan-installment').classList.remove('border-green-500', 'ring-2', 'ring-green-400');
    document.getElementById('selected-badge-onetime').classList.add('hidden');
    document.getElementById('selected-badge-installment').classList.add('hidden');

    const btn = document.getElementById('register-btn');

    if (plan === 'one-time') {
        document.getElementById('plan-onetime').classList.add('border-green-500', 'ring-2', 'ring-green-400');
        document.getElementById('selected-badge-onetime').classList.remove('hidden');
        btn.textContent = 'Pay ₦15,000 One-Time Fee';
        btn.classList.remove('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
        btn.classList.add('bg-brand-secondary', 'text-white', 'hover:bg-orange-600', 'cursor-pointer');
        btn.disabled = false;
    } else if (plan === 'installment') {
        document.getElementById('plan-installment').classList.add('border-green-500', 'ring-2', 'ring-green-400');
        document.getElementById('selected-badge-installment').classList.remove('hidden');
        btn.textContent = 'Start Installment Plan – Pay ₦6,000 Now';
        btn.classList.remove('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
        btn.classList.add('bg-brand-accent', 'text-white', 'hover:bg-indigo-700', 'cursor-pointer');
        btn.disabled = false;
    }
}

// ─── Payment Handler (called by the main button) ──────────────────────────────
async function handlePayment() {
    if (!selectedPaymentPlan) return;

    const audienceCategory = document.getElementById('audienceCategory').value;
    const referralSource   = document.getElementById('referralSource').value;
    const otherReferral    = document.getElementById('otherReferral').value.trim();

    // Determine amount based on plan
    const amountPaid = selectedPaymentPlan === 'one-time' ? 15000 : 6000;

    const formData = {
        surn_name:          document.getElementById('surname').value.trim(),
        other_name:         document.getElementById('otherNames').value.trim(),
        email:              document.getElementById('email').value.trim(),
        phone:              document.getElementById('phone').value.trim(),
        course:             document.getElementById('skillHub').value,
        audience_category:  audienceCategory,
        referral_source:    referralSource,
        referral_other:     referralSource === 'Others' ? otherReferral : null,
        payment_tier:       selectedPaymentPlan,   // 'one-time' | 'installment'
        amount_paid:        amountPaid,
    };

    const button = document.getElementById('register-btn');
    const originalText = button.textContent;
    button.textContent = 'Processing...';
    button.disabled = true;
    button.classList.add('opacity-50', 'cursor-not-allowed');

    try {
        const response = await fetch('https://nysc-api.willerssolutions.com/buy-course', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error('Request failed with status ' + response.status);
        }

        const data = await response.json();

        localStorage.setItem('OrderID', String(data.course_id));
        window.location.href = data.success.data.authorization_url;

    } catch (error) {
        console.error(error);
        button.textContent = originalText;
        button.disabled = false;
        button.classList.remove('opacity-50', 'cursor-not-allowed');

        const msg = document.getElementById('payment-message');
        msg.textContent = 'An error occurred. Please try again.';
        msg.classList.remove('hidden');
    }
}

// ─── Registration Form: Show Payment Options ──────────────────────────────────
document.querySelector('#enrollment-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Basic validation
    const requiredFields = ['surname', 'otherNames', 'email', 'phone', 'skillHub', 'audienceCategory', 'referralSource'];
    for (const id of requiredFields) {
        const el = document.getElementById(id);
        if (!el.value.trim()) {
            el.focus();
            return;
        }
    }

    // Show the selected hub name
    const hubSelect = document.getElementById('skillHub');
    const hubDisplay = document.getElementById('selected-hub-display');
    if (hubDisplay) {
        hubDisplay.textContent = hubSelect.options[hubSelect.selectedIndex].text;
    }

    // Show payment options section
    const paymentSection = document.getElementById('payment-options-section');
    paymentSection.classList.remove('hidden');
    paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Reset plan selection
    selectedPaymentPlan = null;
    const btn = document.getElementById('register-btn');
    btn.textContent = 'Select a Payment Plan Above';
    btn.disabled = true;
    btn.className = 'w-full py-4 bg-gray-300 text-gray-500 text-xl font-bold rounded-xl shadow-xl transition duration-300 cursor-not-allowed';
    document.getElementById('selected-badge-onetime').classList.add('hidden');
    document.getElementById('selected-badge-installment').classList.add('hidden');
    document.getElementById('plan-onetime').classList.remove('border-green-500', 'ring-2', 'ring-green-400');
    document.getElementById('plan-installment').classList.remove('border-green-500', 'ring-2', 'ring-green-400');
});

// ─── Referral "Others" toggle ─────────────────────────────────────────────────
document.getElementById('referralSource').addEventListener('change', function () {
    const otherInput = document.getElementById('otherReferral');
    if (this.value === 'Others') {
        otherInput.classList.remove('hidden');
        otherInput.required = true;
    } else {
        otherInput.classList.add('hidden');
        otherInput.required = false;
        otherInput.value = '';
    }
});

// ─── Hero Image Rotator ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    const images   = ['hero-1.png', 'hero-2.png', 'hero-3.png', 'hero-4.png'];
    const heroImage = document.getElementById('heroImage');
    let index = 0;

    setInterval(() => {
        heroImage.classList.remove('opacity-100');
        heroImage.classList.add('opacity-0');

        setTimeout(() => {
            index = (index + 1) % images.length;
            heroImage.src = images[index];
            heroImage.classList.remove('opacity-0');
            heroImage.classList.add('opacity-100');
        }, 500);
    }, 3000);
});
