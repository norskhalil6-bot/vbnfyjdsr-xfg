// CyberGuard - Social Engineering Awareness Platform Script

// ----------------------------------------------------
// 1. GAME DATA & DATA MODELS
// ----------------------------------------------------

const SIMULATION_LEVELS = [
    {
        id: 1,
        title: "Level 1: Express Delivery SMS",
        senderName: "Express Delivery Alert",
        senderAvatar: "📦",
        senderStatus: "External Sender (+1 800-432-88)",
        timestamp: "Today, 10:42 AM",
        type: "sms",
        correctAction: "block",
        correctFeedback: "Outstanding! You recognized the Smishing attack. Reporting and blocking the sender prevents further contact and alerts mobile networks to blacklist the malicious domain.",
        incorrectFeedback: "Warning! Tapping the link or responding to SMS scams confirms your number is active, leading to more threats, or downloads credentials-stealing malware.",
        messages: [
            {
                sender: "incoming",
                text: "NOTICE: Your package shipment delivery from Aramex has been suspended due to an incorrect postal address. Please pay $1.50 within 12 hours to update your billing address and release shipment details: <span class='suspicious-link'>aramex-parcel-verification-portal.com/update</span>"
            }
        ],
        redFlags: [
            "Unofficial long-code mobile phone number instead of a verified corporate short-code.",
            "Sense of artificial urgency ('within 12 hours') to trigger panic and bypass critical analysis.",
            "Shady lookalike URL domain ('aramex-parcel-verification-portal.com') attempting to mimic the official aramex.com site.",
            "Requests instant payment details to release an unspecified cargo delivery."
        ]
    },
    {
        id: 2,
        title: "Level 2: Telegram Airdrop Bot",
        senderName: "Crypto Reward Distribution",
        senderAvatar: "🤖",
        senderStatus: "External Telegram Bot",
        timestamp: "Just Now",
        type: "telegram",
        correctAction: "block",
        correctFeedback: "Superb decision! Cryptocurrency bots are a common baiting/phishing method. Blocking and reporting the bot helps Telegram secure its network.",
        incorrectFeedback: "Danger! Authorizing third-party links or connecting web3 wallets to unverified giveaway bots grants hackers complete control to drain your wallet.",
        messages: [
            {
                sender: "incoming",
                text: "🎉 CONGRATULATIONS! 🎉<br>You have been randomly selected as one of the 100 lucky winners in the Cyber Airdrop Campaign! You won <b>$5,000 USDT</b>.<br><br>👉 Connect your digital web3 wallet immediately to claim your award: <span class='suspicious-link'>claim-usdt-airdrop-rewards.net</span>"
            }
        ],
        redFlags: [
            "Random unsolicited congratulatory message claiming high rewards for zero contribution.",
            "Urges immediate web3 wallet integration—a primary method for unauthorized smart-contract balance draining.",
            "The web URL has generic extensions and lookalike wording ('claim-usdt-airdrop-rewards.net') instead of a verified, audited platform."
        ]
    },
    {
        id: 3,
        title: "Level 3: PayPal Urgent Security Alert",
        senderName: "PayPaI Security Division",
        senderAvatar: "🔒",
        senderStatus: "security@paypal-verification-portal.com",
        timestamp: "Yesterday, 3:15 PM",
        type: "email",
        correctAction: "block",
        correctFeedback: "Perfect defense! Spearphishing emails use highly structured urgency and fear of loss. Recognizing the incorrect address prevents credential harvesting.",
        incorrectFeedback: "Critical Risk! Clicking 'Verify Account' takes you to a duplicate webpage designed to capture your password, two-factor authentication tokens, and security questions.",
        messages: [
            {
                sender: "incoming",
                text: "<b>CRITICAL ACCOUNT WARNING</b><br>Dear customer,<br><br>We detected a highly suspicious login attempt on your account originating from Moscow, Russia (IP: 185.220.101.4). For security compliance, we have temporarily restricted your transactions.<br><br>Please verify your identity and restore access within 24 hours: <span class='suspicious-link'>paypal-verification-portal.com/login</span>"
            }
        ],
        redFlags: [
            "Lookalike spelling in logo sender text ('PayPaI' using an uppercase 'I' instead of lowercase 'l').",
            "The sender address domain ('paypal-verification-portal.com') is a proxy registered by attackers, not the official paypal.com.",
            "High-fear scenario ('compromised from Russia') combined with an artificial countdown restriction ('24 hours') designed to force action."
        ]
    },
    {
        id: 4,
        title: "Level 4: HR Recruiter LinkedIn Pretext",
        senderName: "Sarah (Global HR Lead)",
        senderAvatar: "💼",
        senderStatus: "External LinkedIn Connection",
        timestamp: "Wednesday, 11:02 AM",
        type: "linkedin",
        correctAction: "block",
        correctFeedback: "Excellent work! Pretexting involves creating an elaborate, highly believable false persona. Demanding personal records like national ID or mother's maiden name is a definitive red flag for identity theft.",
        incorrectFeedback: "Security Breach! Sharing date of birth, mother's maiden name, or national ID numbers allows attackers to bypass security questions on your personal banking apps.",
        messages: [
            {
                sender: "incoming",
                text: "Hi Nour, I saw your outstanding credentials in systems engineering. We have a direct opening for a Principal Architect role starting at $150K + remote perks."
            },
            {
                sender: "outgoing",
                text: "Hi Sarah, thank you for reaching out! I'd love to learn more about the role and interview process."
            },
            {
                sender: "incoming",
                text: "Fantastic! To set up your file in our HR portal, please send me your Date of Birth, Mother's Maiden Name, and a scan of your National ID. Once submitted, we will coordinate the panel interview."
            }
        ],
        redFlags: [
            "Premature request for sensitive PII (Personally Identifiable Information) before any formal interviews or official contract offers.",
            "Recruiter relies on informal chat channels to harvest core personal verification records.",
            "The bait (a massive, frictionless $150k job offer) is structured specifically to make the victim compliant."
        ]
    },
    {
        id: 5,
        title: "Level 5: Elevator USB Baiting",
        senderName: "Office Elevator Floor",
        senderAvatar: "💾",
        senderStatus: "Hardware Threat Vector",
        timestamp: "Today, 08:30 AM",
        type: "usb",
        correctAction: "block", // Handing to IT Security acts as Block & Report in this simulator context
        correctFeedback: "Masterful Response! Handing in the drive directly to Corporate IT Security ensures it is analyzed in a sandboxed, isolated environment. You protected the entire company network!",
        incorrectFeedback: "Disastrous Failure! Pluggable hardware is a deadly vector. Rogue devices like 'Rubber Ducky' inject keystrokes, drop rootkits, or trigger electrostatic discharges that fry your hardware.",
        messages: [
            {
                sender: "incoming",
                text: "⚠️ <b>HARDWARE SCENARIO:</b><br>While walking to your desk in the morning, you find a premium, high-capacity corporate USB drive lying on the elevator floor.<br><br>The drive has a handwritten sticker reading: <b>'Q4 Executive Staff Appraisal & Salary Adjustment Plans.xlsx'</b>."
            }
        ],
        redFlags: [
            "High-value corporate file label ('Executive Salary Adjustments') designed to exploit natural curiosity and greed.",
            "Anonymous, unverified physical storage medium placed strategically in a high-traffic employee area (elevator).",
            "Plugging unvouched devices bypasses all perimeter firewalls instantly."
        ]
    }
];

const ENCYCLOPEDIA_TRICKS = [
    {
        id: "phishing",
        title: "Phishing (Smishing / Vishing)",
        category: "phishing",
        danger: "high",
        summary: "The sending of fraudulent communications that appear to come from a reputable source, typically through email, SMS, or voice calls to steal data.",
        setup: "Attackers construct lookalike sender templates (e.g., matching postal systems or major banks) and purchase domains that look visually identical to official portals. They blast automated lists with alerts regarding package failures or account lockouts, leading users to duplicates of official web pages where they harvest critical login credentials.",
        psychology: "Urgency and fear are the primary tools. By telling the target their bank account is suspended or a shipment will be returned, they trigger panic. The user reacts instantly to resolve the pain point without double-checking the URL or sender origin.",
        defenses: [
            "Never tap clickable links inside unsolicited SMS alerts or external security emails.",
            "Always inspect the domain name letter-by-letter (e.g., PayPaI using capital 'I' instead of 'l').",
            "Manually type the official company website in a clean browser tab to verify critical alerts."
        ],
        example: "💬 SMS from 'POST-OFFICE': Your package couldn't be delivered due to incorrect street data. Update instantly here: tracking-postal-alert-restores.net/status"
    },
    {
        id: "baiting",
        title: "Baiting (Physical & Digital)",
        category: "baiting",
        danger: "high",
        summary: "Promising an item or good (such as a free movie download, crypto, or corporate USB) to entice victims into performing an action that compromises security.",
        setup: "In digital baiting, hackers offer high-speed movie downloads or free cryptocurrency airdrops if you connect a wallet or download a launcher. In physical baiting, they drop USB drives preloaded with keyloggers and malware in office lobbies, parking lots, or elevator floors with curious labels like 'Salary Adjustments'.",
        psychology: "Greed and curiosity. Victims are enticed by free money or confidential payroll information. Curiosity overcomes corporate security protocols, driving them to connect or run malicious components.",
        defenses: [
            "Never connect unverified storage media (USBs, external disks) to your personal or work computers.",
            "Treat free digital reward distributions (e.g., free USDT giveaways) as definitive scams.",
            "Hand over found external media directly to corporate security departments."
        ],
        example: "💾 USB stick on the floor labeled: 'Executive Layoffs Plan Q4 - PRIVATE'"
    },
    {
        id: "pretexting",
        title: "Pretexting",
        category: "pretexting",
        danger: "medium",
        summary: "Creating a fabricated scenario (a pretext) to steal a victim's personal information, typically masquerading as an HR recruiter, customer service agent, or auditor.",
        setup: "The attacker researches the target using open-source intelligence (OSINT) from public social media profiles. They then establish a connection posing as a recruiter offering a high-salary role or an IT support officer resolving a system bug. Once trust is built, they demand personal IDs or mother's maiden name.",
        psychology: "Authority and trust. By posing as high-profile HR leads or corporate officers, they leverage the natural human tendency to cooperate with authoritative figures and helpful specialists.",
        defenses: [
            "Independently verify recruiters through official corporate channels before discussing roles.",
            "Never share verification elements, security answers, or national identity digits on casual chats.",
            "Always question why an external contact requires sensitive credentials before standard procedures."
        ],
        example: "💼 Chat request: 'Hi, I'm Sarah from HR. We love your profile. To register you in our interview portal, please send your National ID and Date of Birth.'"
    },
    {
        id: "tailgating",
        title: "Tailgating & Piggybacking",
        category: "pretexting",
        danger: "medium",
        summary: "An attacker seeking entry to a restricted corporate area by closely following an authorized employee past security checkpoints.",
        setup: "Attackers dress up as delivery workers carrying heavy packages, water bottles, or repair technicians. They wait near secure keycard doors and follow authorized employees, relying on the employee holding the door open for them as a polite gesture.",
        psychology: "Common courtesy and social compliance. People naturally feel awkward letting a door shut in the face of someone holding heavy packages or wearing a corporate uniform. Victims rarely ask for credentials to avoid seeming rude.",
        defenses: [
            "Enforce a strict 'everyone badges in' security policy at all facility gates.",
            "Report any unbadged personnel wandering in secure server areas or offices.",
            "politely ask delivery workers to wait at reception for authorized escorts."
        ],
        example: "📦 Attacker holding large boxes: 'Hey, sorry, can you hold the door? My hands are completely full!'"
    },
    {
        id: "quid-pro-quo",
        title: "Quid Pro Quo",
        category: "baiting",
        danger: "medium",
        summary: "Promising a service or assistance in exchange for credentials, typically posing as IT support resolving a non-existent technical bug.",
        setup: "Attackers make random calls to employees posing as system administrators. They state they are running system maintenance and need to resolve a slow-connection problem on the user's desktop, prompting the victim to disable antivirus shields or share logins.",
        psychology: "Mutual exchange (reciprocity). The target feels they are receiving valuable tech support to fix a problem, and in return, they gladly offer access keys and credential tokens.",
        defenses: [
            "IT support will never ask you to disable security software or share active passwords.",
            "Verify the caller's identity by calling your official IT service desk helpline directly.",
            "Never execute commands or install remote-access utilities under telephonic instruction."
        ],
        example: "📞 Caller: 'Hi, I'm Mark from IT support. We noticed a slow down on your router. I need your password to refresh your network driver.'"
    }
];

// ----------------------------------------------------
// 2. STATE MANAGEMENT
// ----------------------------------------------------

let gameState = {
    globalScore: 100,
    completedLevels: [],
    currentLevelId: 1,
    soundEnabled: true
};

// ----------------------------------------------------
// 3. SYNTHETIC AUDIO ENGINE (Web Audio API)
// ----------------------------------------------------

const AudioEngine = {
    ctx: null,

    init() {
        // AudioContext initialized lazily on first user interaction to bypass browser block policies
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    playSuccess() {
        if (!gameState.soundEnabled) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            // Premium double-chime effect
            const now = this.ctx.currentTime;
            osc.type = "sine";
            
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
            osc.frequency.setValueAtTime(880.00, now + 0.2); // A5
            
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
            
            osc.start(now);
            osc.stop(now + 0.35);
        } catch (e) {
            console.log("Audio play blocked", e);
        }
    },

    playFailure() {
        if (!gameState.soundEnabled) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            const now = this.ctx.currentTime;
            osc.type = "sawtooth";
            
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(80, now + 0.3);
            
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
            
            osc.start(now);
            osc.stop(now + 0.35);
        } catch (e) {
            console.log("Audio play blocked", e);
        }
    },

    playClick() {
        if (!gameState.soundEnabled) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            const now = this.ctx.currentTime;
            osc.type = "sine";
            osc.frequency.setValueAtTime(800, now);
            
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            
            osc.start(now);
            osc.stop(now + 0.05);
        } catch (e) {
            console.log("Audio play blocked", e);
        }
    }
};

// ----------------------------------------------------
// 4. CORE CONTROLLERS & EVENT BINDINGS
// ----------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    // Load local storage states
    loadGameState();
    
    // Core Layout initializations
    switchTab('home');
    initializeNavbar();
    initializeSoundToggle();
    initializeResetButton();
    
    // Core Modules setup
    setupSimulationLab();
    setupEncyclopedia();
    setupLeaderboard();
});

// Navigation and tabs helper
function switchTab(tabName) {
    // Play subtle menu click sound
    AudioEngine.playClick();

    // Toggle navigation links active state
    document.querySelectorAll(".nav-link").forEach(link => {
        if (link.getAttribute("data-tab") === tabName) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    // Toggle active sections display
    document.querySelectorAll(".tab-content").forEach(section => {
        if (section.id === `${tabName}-section`) {
            section.classList.remove("hidden-content");
            section.classList.add("active-content");
        } else {
            section.classList.add("hidden-content");
            section.classList.remove("active-content");
        }
    });

    // Custom view actions upon loading specific tabs
    if (tabName === 'leaderboard') {
        renderLeaderboardTable();
        // Update values in submission block
        document.getElementById("leaderboard-score-val").textContent = gameState.globalScore;
        document.getElementById("leaderboard-levels-val").textContent = `${gameState.completedLevels.length} / 5`;
    }
    
    // Scroll window back to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initializeNavbar() {
    // Bind click handlers to navigation menu links
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const tabName = link.getAttribute("data-tab");
            switchTab(tabName);
        });
    });

    // Logo returns to home
    document.getElementById("logo-link").addEventListener("click", (e) => {
        e.preventDefault();
        switchTab('home');
    });
}

function initializeSoundToggle() {
    const btn = document.getElementById("sound-toggle");
    const iconOn = document.getElementById("sound-on-icon");
    const iconOff = document.getElementById("sound-off-icon");

    btn.addEventListener("click", () => {
        gameState.soundEnabled = !gameState.soundEnabled;
        if (gameState.soundEnabled) {
            iconOn.classList.remove("hidden");
            iconOff.classList.add("hidden");
            AudioEngine.playClick();
        } else {
            iconOn.classList.add("hidden");
            iconOff.classList.remove("hidden");
        }
        saveGameState();
    });
}

function initializeResetButton() {
    document.getElementById("reset-sim-btn").addEventListener("click", () => {
        if (confirm("Are you sure you want to reset all your progress data and scores back to default?")) {
            gameState.globalScore = 100;
            gameState.completedLevels = [];
            gameState.currentLevelId = 1;
            saveGameState();
            
            // Re-render UI
            updateGlobalScoreBadge();
            setupSimulationLab();
            renderLeaderboardTable();
            AudioEngine.playFailure();
        }
    });
}

// ----------------------------------------------------
// 5. LOCAL STORAGE STORAGE MECHANISMS
// ----------------------------------------------------

function saveGameState() {
    localStorage.setItem("cyberguard_save_v2", JSON.stringify(gameState));
}

function loadGameState() {
    const data = localStorage.getItem("cyberguard_save_v2");
    if (data) {
        try {
            const parsed = JSON.parse(data);
            gameState = { ...gameState, ...parsed };
            updateGlobalScoreBadge();
        } catch (e) {
            console.error("Failed parsing local save file", e);
        }
    }
}

function updateGlobalScoreBadge() {
    const badge = document.getElementById("global-score");
    badge.textContent = gameState.globalScore;
    
    // Quick pop micro-animation trigger
    badge.classList.add("pop-score");
    setTimeout(() => {
        badge.classList.remove("pop-score");
    }, 300);
}

// ----------------------------------------------------
// 6. SIMULATION LAB SYSTEM CONTROLLERS
// ----------------------------------------------------

function setupSimulationLab() {
    renderLevelSelector();
    loadActiveLevel();
    bindSimulationActionButtons();
}

function renderLevelSelector() {
    const container = document.getElementById("levels-container");
    container.innerHTML = "";

    SIMULATION_LEVELS.forEach(level => {
        const btn = document.createElement("button");
        btn.className = `level-select-btn`;
        
        if (level.id === gameState.currentLevelId) {
            btn.classList.add("active");
        }
        if (gameState.completedLevels.includes(level.id)) {
            btn.classList.add("completed");
        }

        let cleanTitle = level.title;
        if (level.id === 5) cleanTitle = "Level 5: Office USB Bait";

        btn.innerHTML = `
            <span>${cleanTitle}</span>
            <span class="level-status-dot"></span>
        `;

        btn.addEventListener("click", () => {
            AudioEngine.playClick();
            gameState.currentLevelId = level.id;
            
            // Set active state styling
            document.querySelectorAll(".level-select-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            loadActiveLevel();
            saveGameState();
        });

        container.appendChild(btn);
    });

    // Update status widgets
    document.getElementById("progress-text").textContent = `${gameState.completedLevels.length} / 5`;
    const fillPercent = (gameState.completedLevels.length / 5) * 100;
    document.getElementById("progress-fill").style.width = `${fillPercent}%`;
    document.getElementById("current-sim-score").textContent = gameState.globalScore;

    // Calculate rank title
    let rank = "Novice Defender";
    if (gameState.globalScore >= 160) rank = "Master Shield";
    else if (gameState.globalScore >= 130) rank = "Vigilant Analyst";
    else if (gameState.globalScore >= 110) rank = "Alert Sentinel";
    
    document.getElementById("defense-rank").textContent = rank;
}

function loadActiveLevel() {
    const level = SIMULATION_LEVELS.find(l => l.id === gameState.currentLevelId);
    if (!level) return;

    // 1. Reset dynamic phone labels
    document.getElementById("sender-avatar-badge").textContent = level.senderAvatar;
    document.getElementById("sender-name-display").textContent = level.senderName;
    document.getElementById("sender-status-display").textContent = level.senderStatus;

    // Reset phone feedback panel state
    document.getElementById("feedback-overlay").classList.add("hidden");

    // 2. Render internal cellular phone chat dialogue bubbles
    const chatContainer = document.getElementById("chat-messages-container");
    chatContainer.innerHTML = "";

    // Generate date marker
    const stamp = document.createElement("div");
    stamp.className = "chat-timestamp";
    stamp.textContent = level.timestamp;
    chatContainer.appendChild(stamp);

    // If it's the USB scenario, let's inject a custom hardware alert bubble
    if (level.type === 'usb') {
        const usbIntro = document.createElement("div");
        usbIntro.className = "baiting-intro-container";
        usbIntro.innerHTML = `
            <span class="baiting-title">🔌 Threat Indicator: Hardware Vector</span>
            <span class="baiting-text">The simulator loaded a physical threat. Analyze corporate rules on external physical media tools.</span>
        `;
        chatContainer.appendChild(usbIntro);
    }

    // Render dialogue bubbles
    level.messages.forEach(msg => {
        const wrapper = document.createElement("div");
        wrapper.className = `msg-bubble ${msg.sender === 'incoming' ? 'msg-incoming' : 'msg-outgoing'}`;
        
        const titleText = msg.sender === 'incoming' ? level.senderName : "You";
        wrapper.innerHTML = `
            <span class="bubble-sender-title">${titleText}</span>
            <span class="bubble-text">${msg.text}</span>
        `;
        chatContainer.appendChild(wrapper);
    });

    // Adapt buttons labels if USB context
    const blockTitle = document.querySelector(".block-btn .action-title-primary");
    const blockDesc = document.querySelector(".block-btn .action-desc-secondary");
    const verifyTitle = document.querySelector(".verify-btn .action-title-primary");
    const verifyDesc = document.querySelector(".verify-btn .action-desc-secondary");
    const ignoreTitle = document.querySelector(".ignore-btn .action-title-primary");
    const ignoreDesc = document.querySelector(".ignore-btn .action-desc-secondary");

    if (level.type === 'usb') {
        blockTitle.textContent = "Report to Security";
        blockDesc.textContent = "Hand it to IT security office";
        
        verifyTitle.textContent = "Plug In & Verify";
        verifyDesc.textContent = "Check files on office PC";
        
        ignoreTitle.textContent = "Ignore";
        ignoreDesc.textContent = "Leave drive where it is";
    } else {
        blockTitle.textContent = "Block & Report";
        blockDesc.textContent = "Flag as fraud & terminate";
        
        verifyTitle.textContent = "Reply & Verify";
        verifyDesc.textContent = "Message back or tap links";
        
        ignoreTitle.textContent = "Ignore";
        ignoreDesc.textContent = "Delete message & do nothing";
    }
}

function bindSimulationActionButtons() {
    // Unbind previous listeners to prevent multiple clicks registration
    const oldPanel = document.getElementById("actions-panel");
    const newPanel = oldPanel.cloneNode(true);
    oldPanel.parentNode.replaceChild(newPanel, oldPanel);

    newPanel.querySelectorAll(".action-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const chosenAction = btn.getAttribute("data-action");
            handlePlayerChoice(chosenAction);
        });
    });
}

function handlePlayerChoice(action) {
    const level = SIMULATION_LEVELS.find(l => l.id === gameState.currentLevelId);
    if (!level) return;

    // Check if level has already been cleared
    const alreadyCleared = gameState.completedLevels.includes(level.id);

    // Evaluate choice outcome
    let isCorrect = false;
    let scoreChange = 0;
    
    if (level.type === 'usb') {
        if (action === 'block') { // Block maps to reporting USB
            isCorrect = true;
            scoreChange = alreadyCleared ? 0 : 20; // 20 pts for final level!
        } else if (action === 'verify') {
            isCorrect = false;
            scoreChange = -25; // Fatal trap!
        } else {
            isCorrect = false;
            scoreChange = -5; // Ignored but someone else could find it
        }
    } else {
        // SMS, Telegram, Emails, recruiter.
        // Block & Report is correct. Ignore is neutral-ish, Verify is incorrect.
        if (action === level.correctAction) {
            isCorrect = true;
            scoreChange = alreadyCleared ? 0 : 15;
        } else if (action === 'verify') {
            isCorrect = false;
            scoreChange = -10;
        } else { // ignore
            isCorrect = false;
            scoreChange = -5;
        }
    }

    // Apply score changes
    gameState.globalScore += scoreChange;
    // Lower bounds safety
    if (gameState.globalScore < 0) gameState.globalScore = 0;

    if (isCorrect && !alreadyCleared) {
        gameState.completedLevels.push(level.id);
    }

    // Save states
    saveGameState();

    // 1. Play sounds
    if (isCorrect) {
        AudioEngine.playSuccess();
        triggerFloatingScore(scoreChange, true);
    } else {
        AudioEngine.playFailure();
        triggerFloatingScore(scoreChange, false);
    }

    // 2. Render and slide up feedback inside iPhone screen
    const overlay = document.getElementById("feedback-overlay");
    const badge = document.getElementById("feedback-success-badge");
    const scoreText = document.getElementById("feedback-score-text");
    const explainer = document.getElementById("feedback-explanation");
    const list = document.getElementById("red-flags-list");

    badge.className = "feedback-status-badge " + (isCorrect ? "correct" : "incorrect");
    badge.textContent = isCorrect ? "Correct Decision" : "Threat Compromise";

    scoreText.className = "feedback-score-update " + (isCorrect ? "correct" : "incorrect");
    if (scoreChange > 0) {
        scoreText.textContent = `+${scoreChange} Cyber Guard Points`;
    } else if (scoreChange < 0) {
        scoreText.textContent = `${scoreChange} Security Penalty`;
    } else {
        scoreText.textContent = `Verified Scenario Clear`;
    }

    explainer.textContent = isCorrect ? level.correctFeedback : level.incorrectFeedback;

    // Populated flags list
    list.innerHTML = "";
    level.redFlags.forEach(flag => {
        const li = document.createElement("li");
        li.textContent = flag;
        list.appendChild(li);
    });

    // Show panel overlay inside device mockup screen
    overlay.classList.remove("hidden");

    // Bind Proceed button
    document.getElementById("btn-next-scenario").onclick = () => {
        AudioEngine.playClick();
        overlay.classList.add("hidden");

        // Advance level index state
        if (gameState.currentLevelId < 5) {
            gameState.currentLevelId++;
        } else {
            // Completed all levels, transition to Leaderboard registry page
            switchTab('leaderboard');
            return;
        }

        saveGameState();
        setupSimulationLab();
    };

    // Update score badges immediately
    updateGlobalScoreBadge();
    renderLevelSelector();
}

function triggerFloatingScore(change, isPositive) {
    const indicator = document.getElementById("floating-score-indicator");
    indicator.className = `floating-score ${isPositive ? 'plus' : 'minus'}`;
    
    const prefix = change >= 0 ? "+" : "";
    indicator.textContent = `${prefix}${change} Points`;
    indicator.classList.remove("hidden");

    // Clear after animation ends
    setTimeout(() => {
        indicator.classList.add("hidden");
    }, 2000);
}

// ----------------------------------------------------
// 7. FRAUD ENCYCLOPEDIA CONTROLLER
// ----------------------------------------------------

function setupEncyclopedia() {
    renderEncyclopediaCards();
    
    // Bind search typing events
    const searchInput = document.getElementById("encyclopedia-search");
    searchInput.addEventListener("input", () => {
        renderEncyclopediaCards();
    });

    // Bind category filter tab pill click events
    document.querySelectorAll("#category-filters .filter-pill").forEach(pill => {
        pill.addEventListener("click", () => {
            AudioEngine.playClick();
            document.querySelectorAll("#category-filters .filter-pill").forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            renderEncyclopediaCards();
        });
    });

    // Setup modal operations
    setupModalTabs();
}

function renderEncyclopediaCards() {
    const grid = document.getElementById("encyclopedia-grid");
    grid.innerHTML = "";

    const searchQuery = document.getElementById("encyclopedia-search").value.toLowerCase().trim();
    const activeFilter = document.querySelector("#category-filters .filter-pill.active").getAttribute("data-filter");

    // Filter elements
    const filtered = ENCYCLOPEDIA_TRICKS.filter(trick => {
        const matchesSearch = trick.title.toLowerCase().includes(searchQuery) || 
                              trick.summary.toLowerCase().includes(searchQuery) ||
                              trick.setup.toLowerCase().includes(searchQuery);
        
        const matchesCategory = activeFilter === 'all' || trick.category === activeFilter;

        return matchesSearch && matchesCategory;
    });

    // Render cards
    if (filtered.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-search-state";
        emptyState.style.gridColumn = "1 / -1";
        emptyState.style.textAlign = "center";
        emptyState.style.padding = "40px";
        emptyState.style.color = "var(--text-secondary)";
        emptyState.innerHTML = `
            <p>No attack types matched your keyword query.</p>
            <button class="btn btn-secondary" style="margin-top: 12px;" onclick="document.getElementById('encyclopedia-search').value=''; renderEncyclopediaCards();">Clear Search Filters</button>
        `;
        grid.appendChild(emptyState);
        return;
    }

    filtered.forEach(trick => {
        const card = document.createElement("div");
        card.className = "encyclopedia-card";
        
        card.innerHTML = `
            <div class="encyclopedia-card-meta">
                <span class="category-tag">${trick.category}</span>
                <span class="danger-tag ${trick.danger}">${trick.danger} Risk</span>
            </div>
            <h3>${trick.title}</h3>
            <p>${trick.summary}</p>
            <button class="btn btn-secondary btn-full-width" style="margin-top: auto;">Learn Hacker's Trick</button>
        `;

        // Bind learn details button
        card.querySelector("button").addEventListener("click", () => {
            openEncyclopediaModal(trick);
        });

        grid.appendChild(card);
    });
}

function openEncyclopediaModal(trick) {
    AudioEngine.playClick();
    
    // Fill overlay fields
    document.getElementById("modal-tag").className = `modal-tag ${trick.danger}`;
    document.getElementById("modal-tag").textContent = `${trick.category.toUpperCase()} VECTOR • ${trick.danger.toUpperCase()} RISK`;
    document.getElementById("modal-title").textContent = trick.title;
    document.getElementById("modal-short-desc").textContent = trick.summary;
    
    // Fill tabs panels data
    document.getElementById("modal-setup-text").textContent = trick.setup;
    document.getElementById("modal-example-box").innerHTML = trick.example;
    document.getElementById("modal-psych-text").textContent = trick.psychology;
    
    // Render Psychological bias tags
    const biasContainer = document.getElementById("modal-bias-tags");
    biasContainer.innerHTML = "";
    
    let biases = ["Authority Bias", "Social Proof", "Cognitive Urgency"];
    if (trick.category === 'baiting') biases = ["Curiosity Hook", "Greed Bias", "Reciprocity"];
    if (trick.category === 'phishing') biases = ["Artificial Urgency", "Panic Induction", "Lookalike Trust"];
    
    biases.forEach(b => {
        const pill = document.createElement("span");
        pill.className = "bias-badge";
        pill.textContent = b;
        biasContainer.appendChild(pill);
    });

    // Render defense checkpoints list
    const defenseContainer = document.getElementById("modal-defense-text");
    defenseContainer.textContent = "Establish these baseline behaviors to insulate yourself and your organization against this specific social engineering threat:";
    
    const checklist = document.getElementById("modal-defense-list");
    checklist.innerHTML = "";
    trick.defenses.forEach(def => {
        const li = document.createElement("li");
        li.textContent = def;
        checklist.appendChild(li);
    });

    // Reset inner tabs navigation state inside modal
    document.querySelectorAll(".modal-tab-btn").forEach(btn => {
        btn.classList.remove("active");
        if (btn.getAttribute("data-tab-content") === 'modal-setup') {
            btn.classList.add("active");
        }
    });

    document.querySelectorAll(".modal-panel-view").forEach(panel => {
        panel.classList.add("hidden");
        if (panel.id === 'modal-setup') {
            panel.classList.remove("hidden");
        }
    });

    // Show modal cards container
    const modal = document.getElementById("details-modal");
    modal.classList.remove("hidden");

    // Setup close listeners
    const closeModalFunc = () => {
        AudioEngine.playClick();
        modal.classList.add("hidden");
    };

    document.getElementById("modal-close").onclick = closeModalFunc;
    document.getElementById("modal-action-close").onclick = closeModalFunc;
    
    // Background clicking closures
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeModalFunc();
        }
    };

    // ESC closures key binder
    document.onkeydown = (e) => {
        if (e.key === "Escape") {
            modal.classList.add("hidden");
        }
    };
}

function setupModalTabs() {
    document.querySelectorAll(".modal-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            AudioEngine.playClick();
            
            // Set active tab buttons styling
            document.querySelectorAll(".modal-tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Toggle matching content panels
            const targetPanel = btn.getAttribute("data-tab-content");
            document.querySelectorAll(".modal-panel-view").forEach(panel => {
                if (panel.id === targetPanel) {
                    panel.classList.remove("hidden");
                } else {
                    panel.classList.add("hidden");
                }
            });
        });
    });
}

// ----------------------------------------------------
// 8. DYNAMIC LEADERBOARD SCOREBOARD
// ----------------------------------------------------

const SIMULATED_LEADERBOARD = [
    { name: "Fares Al-Mutairi", score: 175, levels: 5, isUser: false },
    { name: "Dana Al-Ghamdi", score: 160, levels: 5, isUser: false },
    { name: "Zaid Cybersecurity Eng", score: 145, levels: 4, isUser: false },
    { name: "Amal Salem", score: 130, levels: 4, isUser: false },
    { name: "Yousef K.", score: 110, levels: 3, isUser: false }
];

function setupLeaderboard() {
    // Check local storage for existing custom user score lists
    if (!localStorage.getItem("cyberguard_leaderboard")) {
        localStorage.setItem("cyberguard_leaderboard", JSON.stringify(SIMULATED_LEADERBOARD));
    }

    renderLeaderboardTable();

    // Bind form submit operations
    document.getElementById("leaderboard-form").addEventListener("submit", (e) => {
        e.preventDefault();
        
        const input = document.getElementById("player-name-input");
        const name = input.value.trim();
        if (!name) return;

        // Retrieve existing records
        let leaderboard = JSON.parse(localStorage.getItem("cyberguard_leaderboard"));
        
        // Remove previous user entries to avoid duplicates
        leaderboard = leaderboard.filter(item => !item.isUser);

        // Add user entry
        leaderboard.push({
            name: name,
            score: gameState.globalScore,
            levels: gameState.completedLevels.length,
            isUser: true
        });

        // Re-sort scores descending
        leaderboard.sort((a, b) => b.score - a.score);

        // Limit list size to 10 entries max
        if (leaderboard.length > 10) leaderboard.pop();

        // Save
        localStorage.setItem("cyberguard_leaderboard", JSON.stringify(leaderboard));
        
        // Re-render
        renderLeaderboardTable();
        AudioEngine.playSuccess();
        
        // Reset form
        input.value = "";
        alert("Your profile high score was successfully registered in the standings list!");
    });
}

function renderLeaderboardTable() {
    const tableBody = document.getElementById("leaderboard-table-body");
    tableBody.innerHTML = "";

    const data = JSON.parse(localStorage.getItem("cyberguard_leaderboard")) || SIMULATED_LEADERBOARD;

    data.forEach((player, index) => {
        const tr = document.createElement("tr");
        if (player.isUser) {
            tr.style.backgroundColor = "var(--color-sky-dim)";
            tr.style.borderLeft = "4px solid var(--color-sky)";
        }

        // Rank styling badges
        let rankContent = "";
        if (index === 0) rankContent = `<span class="rank-badge rank-1">1</span>`;
        else if (index === 1) rankContent = `<span class="rank-badge rank-2">2</span>`;
        else if (index === 2) rankContent = `<span class="rank-badge rank-3">3</span>`;
        else rankContent = `<span class="rank-badge rank-other">${index + 1}</span>`;

        // User badge indicators
        const badgeLabel = player.isUser ? ` <span class="user-tag-badge">YOU</span>` : "";

        tr.innerHTML = `
            <td style="text-align: center; vertical-align: middle;">${rankContent}</td>
            <td>
                <div class="defender-name-cell">
                    <span>${escapeHTML(player.name)}${badgeLabel}</span>
                </div>
            </td>
            <td style="text-align: right; font-weight: 600;">${player.levels} / 5</td>
            <td style="text-align: right; font-family: 'Outfit', sans-serif; font-weight: 700; color: var(--text-primary);">
                ${player.score}
            </td>
        `;

        tableBody.appendChild(tr);
    });
}

// Security HTML Escape helper utility
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
