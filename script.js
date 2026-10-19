/**
 * AFPMBAI Loan Assistant
 * Pure Client-side Vanilla JavaScript
 */

// Target Inquiry Email
const INQUIRY_EMAIL = "escadpeideas@gmail.com";

// Knowledge Base hango sa opisyal na portal ng AFPMBAI
// Official Sources:
// - https://afpmbai.com.ph/
// - https://afpmbai.com.ph/frequently-asked-questions/
// - https://helpdesk.afpmbai.com.ph/
const KNOWLEDGE_BASE = [
  {
    keywords: ["salary", "salary loan", "ebl", "enhanced basic loan", "sahod", "magkano salary loan"],
    title: "AFPMBAI Salary Loan (Enhanced Basic Loan)",
    text: "Ang Salary Loan (o Enhanced Basic Loan) ay inilaan para sa mga regular members ng AFP, PNP, BJMP, BFP, at PCG na may kaukulang net take-home pay. Ang maximum loan amount at termino ay depende sa inyong sangay ng serbisyo at payslip capacity.",
    requirements: "Pangunahing requirements: Latest 1-2 months original pay slip, Valid AFP/PNP/Unit/Govt ID, at Loan Application Form mula sa opisina o website.",
    sourceTitle: "AFPMBAI Loan Products",
    sourceUrl: "https://afpmbai.com.ph/"
  },
  {
    keywords: ["policy", "policy loan", "insurance loan", "cash value", "equity"],
    title: "AFPMBAI Policy Loan",
    text: "Ang Policy Loan ay pautang laban sa naipong cash value o contractual equity ng inyong permanent life insurance policy sa AFPMBAI. Maaari kang humiram ng hanggang 90% ng kabuuang cash value ng inyong policy nang hindi ito nate-terminate.",
    requirements: "Kailangan ang active policy status (karaniwang may hindi bababa sa 2 o 3 taong contribution depende sa policy), Valid ID, at Policy Loan Form.",
    sourceTitle: "AFPMBAI FAQ - Policy Loan",
    sourceUrl: "https://afpmbai.com.ph/frequently-asked-questions/"
  },
  {
    keywords: ["calamity", "emergency", "bagyo", "lindol", "kalamidad"],
    title: "AFPMBAI Calamity Loan",
    text: "Ang Calamity Loan ay binubuksan para sa mga miyembrong naninirahan o nadestino sa mga lugar na opisyal na idineklara sa ilalim ng State of Calamity ng gobyerno.",
    requirements: "Kailangan ang Barangay Certificate of Residency o Certification ng Unit Commander na nagpapatunay na naapektuhan ng kalamidad, kasama ang latest payslip at ID.",
    sourceTitle: "AFPMBAI Helpdesk & FAQs",
    sourceUrl: "https://afpmbai.com.ph/frequently-asked-questions/"
  },
  {
    keywords: ["eligible", "eligibility", "miyembro", "membership", "sino pwede", "qualify", "pulis", "sundalo"],
    title: "AFPMBAI Membership Eligibility",
    text: "Kasama sa regular membership ng AFPMBAI ang mga unipormado at civilian personnel ng: Armed Forces of the Philippines (AFP), Philippine National Police (PNP), Bureau of Fire Protection (BFP), Bureau of Jail Management and Penology (BJMP), Philippine Coast Guard (PCG), at BuCor.",
    requirements: "Para sa Associate Membership, maaaring mag-apply ang mga legal dependents alinsunod sa umiiral na patakaran ng asosasyon.",
    sourceTitle: "AFPMBAI Official Website",
    sourceUrl: "https://afpmbai.com.ph/"
  },
  {
    keywords: ["contact", "helpdesk", "tawag", "numero", "email", "opisina", "saan", "head office"],
    title: "AFPMBAI Contact & Helpdesk",
    text: "Ang AFPMBAI Head Office ay matatagpuan sa Col. Bonny Serrano Ave. cor. EDSA, Quezon City. Maaari ding lumapit sa pinakamalapit na AFPMBAI Branch o Extension Office sa inyong kampo.",
    requirements: "Maaari silang tawagan sa trunkline o magsumite ng ticket sa opisyal na Helpdesk portal.",
    sourceTitle: "AFPMBAI Helpdesk Portal",
    sourceUrl: "https://helpdesk.afpmbai.com.ph/"
  },
  {
    keywords: ["housing", "bahay", "pabahay", "real estate"],
    title: "AFPMBAI Real Estate / Housing Loan",
    text: "Nag-aalok ang AFPMBAI ng Housing Loan para sa pagbili ng residential lot, house and lot, o home construction para sa mga kwalipikadong miyembro na may sapat na capacity to pay at service tenure.",
    requirements: "Tingnan ang kumpletong property at income requirements sa opisyal na website.",
    sourceTitle: "AFPMBAI Housing",
    sourceUrl: "https://afpmbai.com.ph/"
  }
];

// DOM Elements
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const resetBtn = document.getElementById("reset-btn");
const quickReplies = document.getElementById("quick-replies");

// Modal Elements
const inquiryModal = document.getElementById("inquiry-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const cancelInqBtn = document.getElementById("cancel-inq-btn");
const inquiryForm = document.getElementById("inquiry-form");
const inqQuestion = document.getElementById("inq-question");
const formStatus = document.getElementById("form-status");

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  sendInitialGreeting();
});

// Format time
function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Greeting function
function sendInitialGreeting() {
  chatWindow.innerHTML = "";
  const greetingText = `Mabuhay! Ako ang inyong **AFPMBAI Loan Assistant**.
  
Maaari mo akong tanungin tungkol sa mga opisyal na pautang tulad ng:
• Salary Loan / Enhanced Basic Loan
• Policy Loan (laban sa cash value)
• Calamity / Emergency Loan
• Membership at Contact Channels

Ano po ang nais ninyong malaman ngayon?`;

  appendBotMessage(greetingText);
}

// Maglagay ng mensahe ng user
function appendUserMessage(text) {
  const msgDiv = document.createElement("div");
  msgDiv.className = "message user";
  msgDiv.innerHTML = `
    <div class="message-content">${escapeHTML(text)}</div>
    <div class="message-time">${getCurrentTime()}</div>
  `;
  chatWindow.appendChild(msgDiv);
  scrollToBottom();
}

// Magpakita ng typing indicator
function showTypingIndicator() {
  const typingDiv = document.createElement("div");
  typingDiv.className = "message bot typing";
  typingDiv.id = "typing-indicator";
  typingDiv.innerHTML = `
    <div class="typing-bubble">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
  `;
  chatWindow.appendChild(typingDiv);
  scrollToBottom();
}

function removeTypingIndicator() {
  const indicator = document.getElementById("typing-indicator");
  if (indicator) indicator.remove();
}

// Maglagay ng mensahe ng bot
function appendBotMessage(text, sourceObj = null, showInquiryButton = false) {
  const msgDiv = document.createElement("div");
  msgDiv.className = "message bot";

  let formattedText = escapeHTML(text).replace(/\n/g, "<br>");

  let html = `<div class="message-content">${formattedText}`;

  if (sourceObj && sourceObj.sourceUrl) {
    html += `
      <div class="source-container">
        <strong>Opisyal na Sanggunian:</strong><br>
        <a href="${sourceObj.sourceUrl}" target="_blank" rel="noopener noreferrer" class="source-link">
          🔗 ${escapeHTML(sourceObj.sourceTitle || sourceObj.sourceUrl)}
        </a>
      </div>
    `;
  }

  if (showInquiryButton) {
    html += `
      <div style="margin-top: 10px;">
        <button class="inquiry-prompt-btn" onclick="openInquiryModal()">
          📝 Magsumite ng Inquiry
        </button>
      </div>
    `;
  }

  html += `</div><div class="message-time">${getCurrentTime()}</div>`;
  msgDiv.innerHTML = html;

  chatWindow.appendChild(msgDiv);
  scrollToBottom();
}

// Paghahanap sa Knowledge Base
function processUserQuery(query) {
  showTypingIndicator();

  // Kunwa-kunwaring maikling loading para maging natural ang takbo
  setTimeout(() => {
    removeTypingIndicator();
    const cleanQuery = query.toLowerCase().trim();

    // Hanapin ang tugmang kategorya
    const matched = KNOWLEDGE_BASE.find(item => 
      item.keywords.some(kw => cleanQuery.includes(kw))
    );

    if (matched) {
      const fullResponse = `${matched.text}\n\n📌 **Mga Pangangailangan:** ${matched.requirements}\n\n*Paalala: Ang pinal na computation, interes, at approval ay laging nakabatay sa opisyal na pagsusuri ng AFPMBAI.*`;
      appendBotMessage(fullResponse, {
        sourceTitle: matched.sourceTitle,
        sourceUrl: matched.sourceUrl
      });
    } else {
      // Kapag hindi sigurado o walang eksaktong tugma
      const unverifiedResponse = `Paumanhin, hindi ko po mahanap ang kumpirmadong opisyal na sagot para sa inyong katanungan alinsunod sa verified records ng AFPMBAI.\n\nUpang hindi kayo mabigyan ng maling impormasyon, nais niyo po bang magpadala ng opisyal na inquiry sa email support (${INQUIRY_EMAIL})?`;
      appendBotMessage(unverifiedResponse, {
        sourceTitle: "AFPMBAI Helpdesk",
        sourceUrl: "https://helpdesk.afpmbai.com.ph/"
      }, true);
    }
  }, 600);
}

// Helper: Escape HTML
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Chat form submission
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  appendUserMessage(text);
  userInput.value = "";
  processUserQuery(text);
});

// Quick reply chips
quickReplies.addEventListener("click", (e) => {
  if (e.target.classList.contains("chip")) {
    const query = e.target.getAttribute("data-query");
    appendUserMessage(query);
    processUserQuery(query);
  }
});

// Reset Chat Button
resetBtn.addEventListener("click", () => {
  if (confirm("Nais mo bang burahin ang kasalukuyang usapan at magsimula muli?")) {
    sendInitialGreeting();
  }
});

// Inquiry Modal Controls
window.openInquiryModal = function(prefillQuery = "") {
  inquiryModal.classList.remove("hidden");
  formStatus.className = "form-status hidden";
  formStatus.innerHTML = "";
  if (prefillQuery) {
    inqQuestion.value = prefillQuery;
  }
};

function closeInquiryModal() {
  inquiryModal.classList.add("hidden");
  inquiryForm.reset();
  formStatus.className = "form-status hidden";
  formStatus.innerHTML = "";
}

closeModalBtn.addEventListener("click", closeInquiryModal);
cancelInqBtn.addEventListener("click", closeInquiryModal);

// Close modal kapag pinindot ang backdrop
inquiryModal.addEventListener("click", (e) => {
  if (e.target === inquiryModal) {
    closeInquiryModal();
  }
});

// Inquiry Form Handling
inquiryForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("inq-name").value.trim() || "Hindi binanggit";
  const email = document.getElementById("inq-email").value.trim();
  const phone = document.getElementById("inq-phone").value.trim();
  const question = document.getElementById("inq-question").value.trim();
  const consent = document.getElementById("inq-consent").checked;

  // Validation
  if (!email || !phone || !question || !consent) {
    showFormStatus("Mangyaring punan ang lahat ng kinakailangang (*) field at magbigay ng pahintulot.", "error");
    return;
  }

  // Dahil ito ay tumatakbo sa GitHub Pages nang walang external backend server,
  // bubuo tayo ng pre-formatted mailto URL na ligtas at nagbubukas ng user's email client
  // nang direkta patungo sa escadpeideas@gmail.com.
  const subject = encodeURIComponent(`AFPMBAI Inquiry mula kay: ${name}`);
  const bodyText = encodeURIComponent(
    `Pangalan: ${name}\n` +
    `Email: ${email}\n` +
    `Contact Number: ${phone}\n` +
    `Consent: Sumang-ayon sa Data Privacy terms\n\n` +
    `Katanungan / Inquiry:\n${question}\n\n` +
    `-- Pinadala sa pamamagitan ng AFPMBAI Loan Assistant App --`
  );

  const mailtoLink = `mailto:${INQUIRY_EMAIL}?subject=${subject}&body=${bodyText}`;

  // Ipakita ang malinaw at tapat na mensahe sa status
  showFormStatus(
    `Naihanda na ang inyong mensahe! Bubuksan nito ang inyong email application patungo sa <strong>${INQUIRY_EMAIL}</strong> upang ligtas na maipadala ang inyong inquiry nang hindi inilalantad ang anumang password o lihim na keys.`, 
    "success"
  );

  // Trigger ng mailto link
  setTimeout(() => {
    window.location.href = mailtoLink;
  }, 1000);
});

function showFormStatus(msg, type) {
  formStatus.innerHTML = msg;
  formStatus.className = `form-status ${type}`;
}
