// OPEN / CLOSE CHAT
// Initialize Lucide icons on script load
lucide.createIcons();

// Global variables to hold registration data
let registeredUserData = {};

// --- MASTER KNOWLEDGE BASE FOR CHATBOT ---
const FAQS_DATA = [
    // Category 1: Cost, Payment & Financial Aid (Q1-Q12)
    { category: "Cost, Payment & Financial Aid", q: "How much is the program?", a: "The program cost is a one-time fee of ₦15,000. This fee covers the entire 3-month cohort." },
    { category: "Cost, Payment & Financial Aid", q: "Is it free?", a: "No, the program is not free. It is a paid training program that costs ₦15,000, which includes many valuable services for our learners." },
    { category: "Cost, Payment & Financial Aid", q: "What is the total fee?", a: "The total fee for the entire 3-month program is ₦15,000." },
    { category: "Cost, Payment & Financial Aid", q: "Why does it cost ₦15,000?", a: "We've set the price at ₦15,000 to make it as accessible and affordable as possible. Our goal is to give you the best chance at employment, and the fee covers a comprehensive package that includes training, CV writing, and job placement support." },
    { category: "Cost, Payment & Financial Aid", q: "Is there a discount?", a: "Yes, we have two excellent discount options: Early Bird Discount: The first 100 people to register will receive a 50% discount! Referral Discount: You get a ₦1,000 discount for every person you refer who successfully registers. If you refer 15 people, your own program becomes completely free!" },
    { category: "Cost, Payment & Financial Aid", q: "Can I pay in installments?", a: "While we don't offer direct installments for the ₦15,000 fee, we have a great solution! We've partnered with a financial lending company that can pay your fee for you. You can then pay them back in small, manageable installments." },
    { category: "Cost, Payment & Financial Aid", q: "Tell me more about the loan you mentioned.", a: "Our lending partner provides a loan specifically for this program. They pay us the ₦15,000 fee on your behalf, and you then repay them in flexible installments over 2, 3, 4, 5, or 6 months, depending on the plan you choose." },
    { category: "Cost, Payment & Financial Aid", q: "How do I apply for the loan?", a: "You can get all the details on our website. We also have agents available via our contact center and WhatsApp chat. They will provide all the information and link you directly to the lending company to begin your application." },
    { category: "Cost, Payment & Financial Aid", q: "What are the repayment terms for the loan?", a: "The repayment terms are flexible and depend on your preference. You can choose a plan that lasts from 1 to 5 months. The lending partner will provide the final details, which may include a small interest percentage." },
    { category: "Cost, Payment & Financial Aid", q: "Who is the lending partner?", a: "We work with several different lending partners. This gives you the flexibility to choose the one whose terms and conditions work best for you." },
    { category: "Cost, Payment & Financial Aid", q: "So, is the ₦15,000 a one-time payment for the full 3-month program?", a: "Yes, that's correct. ₦15,000 is the single, one-time payment for the full 3-month program." },
    { category: "Cost, Payment & Financial Aid", q: "What does the fee cover? Does it include the certificate?", a: "The ₦15,000 fee covers a lot! This includes: The full 3-month training, Special masterclasses with industry experts, Professional CV writing services, LinkedIn profile optimization, and a Willers Solutions Certificate of Completion (which is free and sent to your email). The official certificate from the Alison platform is separate and requires a fee, but you can also use our lending partners to finance it!" },
    
    // Category 2: Program Content & Structure (Q13-Q26)
    { category: "Program Content & Structure", q: "What skills can I learn?", a: "You can learn a wide range of high-demand skills! We have specialized hubs for UI/UX Design, Front End Development, Cyber Security, IT Support, Customer Care, Virtual Assistance, Sales, HR, and more." },
    { category: "Program Content & Structure", q: "Can you list all the 'skill hubs'?", a: "Certainly! Our current skill hubs include: Sales and Business Development, Cyber Security, Accounting and Financing, Customer Care, Virtual Assistant, UI/UX Design, Front End Development, Data Analytics, Human Resources (HR), and Networking." },
    { category: "Program Content & Structure", q: "I want to learn Cyber Security, do you have that?", a: "Yes, we do! Cyber Security is one of our specialized skill hubs." },
    { category: "Program Content & Structure", q: "What about UI/UX Design?", a: "Yes, UI/UX Design is one of our most popular skill hubs." },
    { category: "Program Content & Structure", q: "How long is the program?", a: "The program is designed to be completed in three months." },
    { category: "Program Content & Structure", q: "Is this training online or physical?", a: "All our training is 100% online, so you can learn from anywhere in Nigeria." },
    { category: "Program Content & Structure", q: "What is 'Alison'? Is it a good platform?", a: "Alison is a major global e-learning platform that gives millions of people access to online courses. Yes, it is a well-respected and high-quality platform for our training content." },
    { category: "Program Content & Structure", q: "Do I get a certificate after?", a: "Yes, you receive two types of certificates: Willers Solutions Certificate: You get a free Certificate of Completion from us, which will be sent to your email. Alison Platform Certificate: You can also choose to get an official certificate from the Alison platform, but this one requires a separate payment." },
    { category: "Program Content & Structure", q: "Is the certificate recognized by employers?", a: "Yes, absolutely. The certificates are recognized by employers as the training is based on a global standard and provided via a globally recognized platform (Alison)." },
    { category: "Program Content & Structure", q: "Is it an international certificate?", a: "Yes, the certificate from the Alison platform is internationally recognized." },
    { category: "Program Content & Structure", q: "How is the training delivered? Is it video?", a: "The training is delivered using a mix of high-quality videos and informative texts to support your learning." },
    { category: "Program Content & Structure", q: "Is it self-paced, or do I have to attend live classes?", a: "The training is self-paced, giving you the flexibility to learn at a time that works best for you." },
    { category: "Program Content & Structure", q: "What if I miss a class?", a: "Since the program is self-paced, there are no 'live' classes to miss! You just need to make sure you complete all the modules within the 3-month cohort period." },
    { category: "Program Content & Structure", q: "Will I build real projects for a portfolio?", a: "Yes, for many of the skill hubs, you will. For example, participants in the UI/UX hub will be required to build a project to show they have understood what they've been taught." },

    // Category 3: Job Placement & Outcomes (Q27-Q36)
    { category: "Job Placement & Outcomes", q: "Is a job guaranteed?", a: "While we cannot guarantee a job (as no one can), we provide comprehensive job placement support. We do our absolute best to push your professionally-written CV to our network of partner companies for possible employment." },
    { category: "Job Placement & Outcomes", q: "How do you help me get a job?", a: "We help you in three key ways: We professionally write your CV. We help you build a professional LinkedIn profile. We actively push your new CV to our network of hiring companies." },
    { category: "Job Placement & Outcomes", q: "What exactly is 'job placement support'?", a: "Our job placement support is a 3-part service: CV Writing: We help you write a professional CV. LinkedIn Optimization: We help you build a professional LinkedIn account. Job Matching: We help you push your CV to different companies for possible employment." },
    { category: "Job Placement & Outcomes", q: "What companies do you partner with?", a: "As an HR and outsourcing company, Willers Solutions already has a large, established network of corporate clients who use our services to find talent. We push your CV to this existing network of companies that are actively hiring." },
    { category: "Job Placement & Outcomes", q: "Can you name some of the companies that will hire me?", a: "We can't name a specific company that will hire you, because it all depends on your skill set and which companies are hiring for that role at that moment. We match your specific skills to the companies in our network that have that specific need." },
    { category: "Job Placement & Outcomes", q: "Has anyone gotten a job from this program before?", a: "This is a brand new initiative, so you would be part of our first cohort! We started this program precisely because we see the skills gap in the market every day. We are confident this program will help our graduates get jobs." },
    { category: "Job Placement & Outcomes", q: "What kind of jobs can I get with this?", a: "The kind of job you can get will depend entirely on the skill hub you specialize in. For example, completing the UI/UX hub will prepare you for a role as a Junior UI/UX Designer." },
    { category: "Job Placement & Outcomes", q: "What is 'application advocacy'?", a: "'Application advocacy' means we actively support your application. We act as the main contact for your profile, we present you to companies, and we speak on your behalf to help you secure interviews." },
    { category: "Job Placement & Outcomes", q: "Do you help me write my CV?", a: "Yes, absolutely. We will help you write a professional CV. This service is included in the program." },
    { category: "Job Placement & Outcomes", q: "Do you just train me, or do you really connect me to jobs?", a: "We do both. We train you, we show you how to continue your learning, and we actively connect you with job opportunities." },

    // Category 4: Legitimacy & Trust (Q37-Q42)
    { category: "Legitimacy & Trust", q: "Is this program real?", a: "Yes, the program is 100% real. It is a new initiative from Willers Solutions. We encourage you to check our official website, willerssolutions.com, to learn more about our company." },
    { category: "Legitimacy & Trust", q: "Is Willers Solutions a registered company?", a: "Yes, Willers Solutions is a fully registered company and has been operating as a leading HR and outsourcing firm for over 10 years." },
    { category: "Legitimacy & Trust", q: "Where is your office? Can I come and see you?", a: "Yes, you can. Our main offices are in Lagos (at Ogba and Ikorodu). We also have a branch in Canada." },
    { category: "Legitimacy & Trust", q: "How do I know this is not a scam?", a: "We understand your concern. You can verify us in several ways: You can book a live video call with one of our agents. If you are in Lagos, you are welcome to visit our office in Ogba to see us in person." },
    { category: "Legitimacy & Trust", q: "Who is the SUG partner?", a: "We are in the process of partnering with many SUGs across the country. Our current partner that we are working with is the Student Union Government at the University of Ilorin." },
    { category: "Legitimacy & Trust", q: "Can I see testimonials from past students?", a: "This is a brand new program, so you will be part of the very first group! We look forward to your testimony. In the coming year, we will have many testimonials from people who have learned and achieved great things through this program." },

    // Category 5: Logistics & How to Join (Q43-Q50)
    { category: "Logistics & How to Join", q: "How do I register?", a: "Registration is simple! Go to our website and click the 'Enroll Now' link. Go through the registration process and make your payment. Your username and password will be automatically sent to your email." },
    { category: "Logistics & How to Join", q: "What are the requirements to join?", a: "The main requirement for this cohort is to be a currently serving NYSC member." },
    { category: "Logistics & How to Join", q: "Do I need to be a corper (NYSC member) to join?", a: "Yes, for now, we are specifically targeting NYSC members as they are the newest graduates. In the future, we plan to widen the scope to include anyone looking to change their career, but for now, it is for corps members." },
    { category: "Logistics & How to Join", q: "When does the next cohort start?", a: "The pilot phase of the program begins on December 1st, 2025. The first official 3-month cohort starts on January 1st, 2026. We will run the program three times a year." },
    { category: "Logistics & How to Join", q: "What's the difference between this and just going on Alison myself?", a: "That is a great question! The Alison platform by itself only provides the videos. Our program is a complete service that includes: Guided Learning: We give you a streamlined, specific career path, not just thousands of random courses. Expert Masterclass: You get access to live masterclasses with industry experts (with 10+ years of experience) who will guide you. CV & LinkedIn: We professionally write your CV and optimize your LinkedIn profile. Job Placement: We actively push your profile to our network of hiring companies. Coming through us is the best way to ensure you get a full, career-ready package." },
    { category: "Logistics & How to Join", q: "Do I need a laptop?", a: "It depends on the skill you are learning, but for hubs like UI/UX or Front End, a laptop is essential. If you are a corps member and don't have one, our lending partner can also provide a loan for you to get a laptop, which you can pay back in installments." },
    { category: "Logistics & How to Join", q: "Is this for all NYSC members across Nigeria?", a: "Yes, this program is open to all currently serving NYSC members anywhere in Nigeria." },
    { category: "Logistics & How to Join", q: "Who are the 'industry experts' teaching?", a: "We are bringing in experts from various fields who have a minimum of 10 years of real-world experience. They will host masterclasses to give you deep insights into the career path you've chosen and teach you how to excel in it." }
];

// This is used to pass the knowledge base to the Gemini API for grounding the chatbot
const programKnowledgeBase = {};
FAQS_DATA.forEach(item => {
    programKnowledgeBase[item.q.toLowerCase().replace(/[^a-z0-9]/g, '_')] = item.a;
});
const knowledgeBaseString = JSON.stringify(programKnowledgeBase);

// Skill Descriptions for the Modal
const skillDescriptions = {
    'Customer Support': { summary: "Master the art of customer relationship management, conflict resolution, and effective communication to deliver world-class service. Essential for retail, tech, and service industries." },
    'IT Support': { summary: "Gain foundational knowledge in troubleshooting hardware, software, network issues, and managing technical infrastructures. This hub leads to roles like helpdesk analyst or field support." },
    'Human Resources': { summary: "Learn the fundamentals of recruitment, employee relations, payroll processing, and organizational development. Ideal for administrative and talent management roles." },
    'Finance & Accounting': { summary: "Focus on basic bookkeeping, financial reporting, budget management, and compliance. Prepares you for entry-level roles in corporate finance departments." },
    'Business Admin': { summary: "Develop strong organizational, clerical, and operational skills necessary to manage day-to-day business activities and support executive teams efficiently." },
    'Sales': { summary: "Acquire persuasive communication skills, lead generation techniques, and customer lifecycle management to drive revenue growth for any business." },
    'Cyber Security': { summary: "Introduction to digital security, risk assessment, network protection, and common threat mitigation strategies. A rapidly growing sector globally." },
    'Front End Development': { summary: "Learn the core technologies (HTML, CSS, JavaScript) to build the user-facing side of websites and applications. Create responsive and engaging digital experiences." },
    'UI/UX Design': { summary: "Focus on user interface (UI) design principles and user experience (UX) research to create intuitive, appealing, and effective software layouts and products." },
    'Project Management': { summary: "Master the processes of planning, executing, and closing projects, including scope definition, risk management, and team coordination using agile or waterfall methods." },
    'Data Analysis': { summary: "Learn to collect, clean, and interpret complex datasets using tools like Excel or Python. Translate raw data into actionable insights for business decision-making. High-value skill in the Nigerian market." },
    'Virtual Assistant': { summary: "Develop advanced digital organizational skills, calendar management, social media coordination, and remote business support services. Perfect for the growing gig and remote work economy." }
};

// --- CHATBOT FUNCTIONS ---

function showTypingIndicator() {
    document.getElementById('typing-indicator').classList.remove('hidden');
    document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
}

function hideTypingIndicator() {
    document.getElementById('typing-indicator').classList.add('hidden');
}

function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) {
        document.getElementById('chat-input').focus();
    }
}

function appendMessage(sender, text) {
    const messagesContainer = document.getElementById('chat-messages');
    
    // Check if typing indicator is visible, if so, insert message above it
    const typingIndicator = document.getElementById('typing-indicator');
    if (!typingIndicator.classList.contains('hidden')) {
        messagesContainer.insertBefore(createMessageElement(sender, text), typingIndicator);
    } else {
        messagesContainer.appendChild(createMessageElement(sender, text));
    }

    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto-scroll to bottom
}

function createMessageElement(sender, text) {
    const messageEl = document.createElement('div');
    messageEl.classList.add('flex', sender === 'user' ? 'justify-end' : 'justify-start');
    
    const contentEl = document.createElement('div');
    const classes = sender === 'user' 
        ? 'chat-message bg-brand-accent text-white self-end' 
        : 'chat-message bg-white text-gray-800 self-start border border-gray-200';
    
    contentEl.classList.add(...classes.split(' ')); 
    contentEl.textContent = text;

    messageEl.appendChild(contentEl);
    return messageEl;
}

async function sendMessage(event) {
    event.preventDefault();
    const inputEl = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const userText = inputEl.value.trim();

    if (!userText) return;

    // 1. Display user message and set typing indicator
    appendMessage('user', userText);
    inputEl.value = '';
    inputEl.disabled = true;
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<span data-lucide="loader" class="w-5 h-5 animate-spin-slow"></span>';
    lucide.createIcons();
    showTypingIndicator();
    
    // 2. Construct the system prompt using the knowledge base
    const systemPrompt = `You are the Willers Solutions Youth Empowerment Program Assistant. Your goal is to help prospective students enroll by answering their program questions professionally, concisely, and encouragingly. You MUST base your answers ONLY on the following knowledge base (in JSON format). If the answer is not contained in this data, you must politely state that you cannot answer that specific question.
    
    Knowledge Base: ${knowledgeBaseString}`;
    
    // 3. Call the Gemini API
    const responseText = await callGeminiAPI(userText, systemPrompt);
    
    // 4. Hide indicator and display AI response
    hideTypingIndicator();
    appendMessage('bot', responseText);

    // 5. Reset UI
    inputEl.disabled = false;
    sendBtn.disabled = false;
    sendBtn.innerHTML = '<span data-lucide="send" class="w-5 h-5"></span>';
    lucide.createIcons();
    inputEl.focus();
}

// --- GEMINI CORE FUNCTIONS ---

async function callGeminiAPI(userQuery, systemPrompt, retryCount = 0) {
    const payload = {
        Title: userQuery,
    };

    try {
        const response = await fetch("https://nysc-api.willerssolutions.com/ai-chat", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            if (response.status === 429 && retryCount < 5) {
                const delay = Math.pow(2, retryCount) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                return callGeminiAPI(userQuery, systemPrompt, retryCount + 1);
            }
            throw new Error(`API call failed with status: ${response.status}`);
        }

        const result = await response.json();
        return result.success || "Error: No generated content found.";

    } catch (error) {
        // console.error("Gemini API Error:", error);
        return `Error: Failed to generate content. Please try again. (${error.message})`;
    }
}

// --- OTHER FUNCTIONS ---

async function generateCareerRoadmap(skill) {
    const btn = document.getElementById('generate-roadmap-btn');
    const loadingEl = document.getElementById('roadmap-loading');
    const outputEl = document.getElementById('roadmap-output');

    btn.disabled = true;
    loadingEl.classList.remove('hidden');
    outputEl.classList.add('hidden');

    const systemPrompt = "You are a Nigerian career coach specializing in youth employment. Provide a concise, action-oriented, 3-step career roadmap for a graduate looking to enter the specified industry in Nigeria. Ensure the output is formatted with bold step numbers and clear headings. Do not include a conversational introduction or conclusion.";
    const userQuery = `Generate a 3-step career roadmap for an entry-level professional focusing on the ${skill} specialization.`;

    const result = await callGeminiAPI(userQuery, systemPrompt);

    outputEl.textContent = result;
    outputEl.classList.remove('hidden');
    loadingEl.classList.add('hidden');
    btn.disabled = false;
}


async function generateCVSummary() {
    if (!registeredUserData.skillHub) {
        document.getElementById('summary-text').textContent = "Please complete the registration (Step 1) before using this tool.";
        document.getElementById('summary-output').classList.remove('hidden');
        return;
    }

    const btn = document.getElementById('generate-summary-btn');
    const loadingEl = document.getElementById('summary-loading');
    const outputEl = document.getElementById('summary-output');
    const outputTextEl = document.getElementById('summary-text');

    btn.disabled = true;
    loadingEl.classList.remove('hidden');
    outputEl.classList.add('hidden');
    
    const skill = registeredUserData.skillHub;
    const systemPrompt = "You are a professional CV writing assistant. Write a concise, powerful, 3-sentence summary for a LinkedIn/CV profile focusing on readiness for a job in the specified industry. The summary must be written in the first person (I am/I bring/My focus is).";
    const userQuery = `Write a 3-sentence professional profile summary for someone specialized in ${skill}.`;

    const result = await callGeminiAPI(userQuery, systemPrompt);

    outputTextEl.textContent = result.trim();
    outputEl.classList.remove('hidden');
    loadingEl.classList.add('hidden');
    btn.disabled = false;
}


function showSkillDetails(skillKey) {
    const data = skillDescriptions[skillKey];
    if (!data) return;

    document.getElementById('modal-skill-title').textContent = skillKey;
    document.getElementById('modal-skill-description').textContent = data.summary;
    document.getElementById('generate-roadmap-btn').dataset.skill = skillKey;

    // Reset previous LLM outputs in the modal
    document.getElementById('roadmap-output').innerHTML = '';
    document.getElementById('roadmap-output').classList.add('hidden');
    document.getElementById('roadmap-loading').classList.add('hidden');
    document.getElementById('generate-roadmap-btn').disabled = false;

    const modal = document.getElementById('skill-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    lucide.createIcons();
}

function closeSkillDetails(event) {
    if (!event || event.target.id === 'skill-modal') {
        const modal = document.getElementById('skill-modal');

        modal.classList.add('hidden');
        modal.classList.remove('flex');

        // Redirect
        window.location.href = "#registration";
    }
}

function handleRegistration(event) {
    event.preventDefault();

    const form = document.getElementById('enrollment-form');
    const messageEl = document.getElementById('registration-message');
    const paymentSection = document.getElementById('payment-options-section');
    const registrationSection = document.getElementById('registration-form-section');
    const selectedHubDisplay = document.getElementById('selected-hub-display');
    
    registeredUserData = {
        surname: form.surname.value,
        otherNames: form.otherNames.value,
        email: form.email.value,
        phone: form.phone.value,
        skillHub: form.skillHub.value,
        cohortStartDate: new Date().toISOString().split('T')[0] 
    };

    // MOCK: Show registration success message
    messageEl.textContent = `Thank you, ${registeredUserData.surname}! Registration successful. Check your email for details, then proceed to Step 2: Payment.`;
    messageEl.classList.remove('hidden', 'text-brand-accent', 'text-red-600');
    messageEl.classList.add('text-brand-secondary', 'font-bold', 'p-2', 'bg-brand-secondary/10', 'rounded-lg');

    selectedHubDisplay.textContent = registeredUserData.skillHub;
    
    registrationSection.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    registrationSection.style.opacity = '0';
    registrationSection.style.transform = 'translateY(-20px)';

    // Hide registration and show payment after transition
    setTimeout(() => {
        registrationSection.classList.add('hidden');
        paymentSection.classList.remove('hidden');
        
        paymentSection.style.opacity = '0';
        paymentSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            paymentSection.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            paymentSection.style.opacity = '1';
            paymentSection.style.transform = 'translateY(0)';
            // Scroll to payment section
            paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Reset summary tool output on new registration
            document.getElementById('summary-output').classList.add('hidden');
            document.getElementById('summary-loading').classList.add('hidden');
            document.getElementById('generate-summary-btn').disabled = false;

        }, 50); 
    }, 500);
}

function initiatePayment(amount, paymentType) {
    const paymentMessageEl = document.getElementById('payment-message');

    if (!registeredUserData.email) {
        paymentMessageEl.textContent = 'Error: Please complete the registration form (Step 1) first.';
        paymentMessageEl.classList.remove('hidden');
        paymentMessageEl.classList.remove('text-brand-secondary');
        paymentMessageEl.classList.add('text-red-600');
        return;
    }

    // MOCK: Payment Gateway Call
    paymentMessageEl.textContent = `[MOCK PAYMENT INITIATED] Connecting to secure gateway for ₦${amount.toLocaleString()}... (Check your console for mock data.)`;
    paymentMessageEl.classList.remove('hidden', 'text-brand-primary', 'bg-brand-primary/10');
    paymentMessageEl.classList.add('text-red-600', 'bg-red-50');
    
    // MOCK: Assuming payment success after 3 seconds
    setTimeout(() => {
        paymentMessageEl.textContent = `SUCCESS! Welcome to the Youth Empowerment Program! Your payment of ₦${amount.toLocaleString()} is confirmed.`;
        paymentMessageEl.classList.remove('text-red-600', 'bg-red-50');
        paymentMessageEl.classList.add('text-brand-primary', 'font-bold', 'bg-brand-primary/10');

        // Disable buttons after success
        const buttons = document.querySelectorAll('#payment-options-section button');
        buttons.forEach(btn => {
            if (btn.id !== 'generate-summary-btn') {
                btn.disabled = true;
                btn.textContent = 'ENROLLED!';
                btn.classList.add('opacity-50', 'cursor-not-allowed');
            }
        });

    }, 3000);
}

// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('enrollment-form');
    if (form) {
        form.addEventListener('submit', handleRegistration);
    }
});