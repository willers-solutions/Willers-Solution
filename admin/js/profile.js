// document.addEventListener('DOMContentLoaded', async function () {
    
//     const apiUrl = "https://api.payuee.com/profile-save";

//     const requestOptions = {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         credentials: 'include', // set credentials to include cookies
//     };

//     try {
//         const response = await fetch(apiUrl, requestOptions);

//         if (!response.ok) {
//             const errorData = await response.json();

//             // console.log(errorData);

//             if (errorData.error === 'failed to get user from request') {
//                 // need to do a data of just null event 
//                 // displayErrorMessage();
//             } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
//                 // let's log user out the users session has expired
//                 // logUserOutIfTokenIsExpired();
//             }else {
//                 // document.getElementById('toggle-first-name-main').textContent = "...";
//                 // document.getElementById('toggle-last-name-main').textContent = "...";
//                 // document.getElementById('toggle-address-main').textContent = "...";
//                 // document.getElementById('referral_link_number').textContent = "...";
//             }
//             return;
//         }

//         const responseData = await response.json();
//         // this is for the previous data
//         // var firstNamee = document.getElementById('toggle-first-name-main');
//         // var lastNamee = document.getElementById('toggle-last-name-main'); 
//         // var homeAddress = document.getElementById('toggle-address-main');
//         // var referralNum = document.getElementById('referral_link_number');
//         // var phoneNumberActivated = document.getElementById('link_whatsapp_ai');

//         var totalAmount = document.getElementById('total-donations');
//         var totalAmountMonths = document.getElementById('total-donations-months');
//         var totalBalance = document.getElementById('total-balance');
//         // var totalAmount = document.getElementById('total-donations');
//         // var totalAmount = document.getElementById('total-donations');
//         totalAmount.textContent = formatNaira(responseData.success.AccountBalance);
//         totalAmountMonths.textContent = formatNaira(responseData.success.AccountBalance);
//         totalBalance.textContent = formatNaira(responseData.success.AccountBalance);

//     } finally {
//     }
// });

// function formatNaira(amount) {
//   // Ensure input is a number
//   if (isNaN(amount)) return '₦0.00';
  
//   return new Intl.NumberFormat('en-NG', {
//     style: 'currency',
//     currency: 'NGN'
//   }).format(amount);
// }
