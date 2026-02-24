export type Project = {
    slug: string;
    name: string;
    tag: "Research" | "Publication" | "Project";
    color: { hex: string; code: string; name: string };
    desc: string;
    github: string;
    showGithub?: boolean;
    showInGrid?: boolean;
    fullDescription: string;
    highlights: string[];
    tech: string[];
    period: string;
    org: string;
    pdf?: string;
};

const PANTONE = [
    { hex: "#D2362B", code: "18-1662 TCX", name: "Flame Scarlet" },
    { hex: "#E8A820", code: "14-1064 TCX", name: "Saffron" },
    { hex: "#1B3F6B", code: "19-4052 TCX", name: "Classic Blue" },
    { hex: "#2A9D8F", code: "15-5718 TCX", name: "Biscay Green" },
    { hex: "#4A5240", code: "19-0323 TCX", name: "Chive" },
    { hex: "#7B9EB5", code: "17-4021 TCX", name: "Faded Denim" },
    { hex: "#E07B39", code: "16-1359 TCX", name: "Orange Peel" },
    { hex: "#1A6B7A", code: "18-4528 TCX", name: "Mosaic Blue" },
    { hex: "#E8D8A0", code: "13-0822 TCX", name: "Sunlight" },
    { hex: "#E8A898", code: "14-1318 TCX", name: "Coral Pink" },
    { hex: "#8B4A2A", code: "18-1345 TCX", name: "Cinnamon Stick" },
    { hex: "#6B5070", code: "18-3513 TCX", name: "Grape Compote" },
    { hex: "#5B6EAE", code: "18-3845 TCX", name: "Blue Iris" },
    { hex: "#3D7A6E", code: "17-5126 TCX", name: "Teal Green" },
];

export const PROJECTS: Project[] = [
    {
        slug: "nasa-eye-tracking",
        name: "NASA Eye-Tracking",
        tag: "Research",
        color: PANTONE[2],
        desc: "Fighter pilot fatigue detection via OpenCV & ArUco markers",
        github: "https://github.com/CBowers28/Senior_Project",
        showGithub: true,
        period: "Oct 2024 – Present",
        org: "Ruiz HCI Lab · University of Florida",
        fullDescription:
            "Developed eye-tracking software for a NASA-funded project focused on detecting fighter pilot fatigue during high-stress flight simulations. The system uses a Pupil Labs Core eye-tracking headset combined with ArUco marker detection to map gaze onto a physical cockpit display, enabling real-time fatigue analysis.",
        highlights: [
            "Built a real-time gaze mapping pipeline using OpenCV and ArUco markers to correlate eye position with specific cockpit instrument panels",
            "Integrated Pupil Labs Core hardware via ZMQ for low-latency gaze data streaming",
            "Implemented fatigue classification heuristics based on blink rate, fixation duration, and saccade velocity",
            "Developed a data collection pipeline compliant with university RISK/IRB protocols for human subject research",
        ],
        tech: ["Python", "OpenCV", "ArUco", "Pupil Labs", "ZMQ", "NumPy", "CUDA"],
    },
    {
        slug: "self-gaze-ar",
        name: "Self-Gaze in AR",
        tag: "Publication",
        color: PANTONE[3],
        desc: "IEEE paper: Uni- vs Bi-directional gaze visualization in collocated AR tasks",
        github: "",
        showGithub: false,
        pdf: "/papers/self-gaze-ar.pdf",
        period: "Oct 2024 – Present",
        org: "Ruiz HCI Lab · University of Florida",
        fullDescription:
            "Co-authored an IEEE paper investigating whether self-gaze visualization is beneficial in collocated augmented reality collaboration. The study compared uni-directional (partner gaze only) and bi-directional (self + partner gaze) shared-gaze visualizations in a virtual sorting task performed by pairs of HoloLens 2 users.",
        highlights: [
            "Designed and developed a collocated AR collaborative sorting task using HoloLens 2 and Unity",
            "Implemented both uni- and bi-directional shared-gaze visualization modes for within-subjects comparison",
            "Conducted a user study with human participants under IRB-approved protocols",
            "Results suggest self-gaze is not always necessary but improves task confidence in certain collocated settings",
        ],
        tech: ["Unity", "C#", "HoloLens 2", "Microsoft AR Toolkit", "Python", "R", "LaTeX"],
    },
    {
        slug: "companion-agent-study",
        name: "Companion Agent Study",
        tag: "Publication",
        color: PANTONE[9],
        desc: "Impact of companion agent self-disclosure levels on user perception",
        github: "",
        showGithub: false,
        pdf: "/papers/companion-agent.pdf",
        period: "Oct 2024 – Present",
        org: "Ruiz HCI Lab · University of Florida",
        fullDescription:
            "Co-authored a research paper studying how varying levels of self-disclosure in AI companion agents affect user perception, trust, and engagement. The study deployed a full-stack web application for structured user interactions, with a secure backend pipeline for data collection and analysis.",
        highlights: [
            "Built a full-stack web application for deploying and logging structured user interactions with AI companion agents",
            "Designed a secure data pipeline and server compliant with university RISK protocol",
            "Measured user perception across multiple self-disclosure conditions using validated survey instruments",
            "Analyzed results using statistical methods in R to identify significant disclosure-level effects on trust and likability",
        ],
        tech: ["Python", "React", "TypeScript", "Flask", "R", "LaTeX", "PostgreSQL"],
    },
    {
        slug: "algogators-risk-framework",
        showGithub: false,
        showInGrid: true,
        name: "AlgoGators Risk Framework",
        tag: "Project",
        color: PANTONE[1],
        desc: "Stop-loss thresholds & performance alerts with pandas & NumPy",
        github: "",
        period: "Jan 2024 – Oct 2024",
        org: "AlgoGators Investment Fund · University of Florida",
        fullDescription:
            "Led the development of a risk management framework for the AlgoGators Investment Fund, a student-run algorithmic trading organization. Designed stop-loss mechanisms and performance alert systems that enabled the fund to detect and respond to adverse market conditions in real time.",
        highlights: [
            "Designed and implemented stop-loss thresholds and drawdown limits using pandas and NumPy to protect fund capital",
            "Built automated performance alert systems that notified the team of risk events via threshold-based triggers",
            "Led a team of five analysts, reviewing and validating software before system integration",
            "Reduced integration defects and accelerated deployment by introducing code review and testing workflows",
        ],
        tech: ["Python", "pandas", "NumPy", "Matplotlib", "Git", "SQL", "R", "C++"],
    },
    {
        slug: "llm-sentiment-analysis",
        name: "LLM Sentiment Analysis",
        tag: "Research",
        color: PANTONE[0],
        desc: "Political sentiment analysis via cosine similarity on UF supercomputer",
        github: "",
        showGithub: false,
        period: "Dec 2025 – Present",
        org: "Digital Markets Initiative · University of Florida",
        fullDescription:
            "Created an LLM-based pipeline to analyze political sentiment in large text corpora as part of the Digital Markets Initiative's research into the economic and political impact of foundational models. Used cosine similarity on embeddings generated via API calls to the UF HiPerGator supercomputer.",
        highlights: [
            "Built an LLM inference pipeline using API calls to UF's HiPerGator supercomputer for large-scale text processing",
            "Implemented cosine similarity analysis on sentence embeddings to cluster and classify political sentiment",
            "Applied Scikit-Learn, NumPy, and TensorFlow for model training and embedding generation",
            "Research contributing to ongoing work on the economic impact of foundational AI models",
        ],
        tech: ["Python", "Scikit-Learn", "NumPy", "TensorFlow", "Keras", "Pandas", "HiPerGator"],
    },
    {
        slug: "aws-web-migration",
        showGithub: false,
        showInGrid: true,
        name: "AWS Web Migration",
        tag: "Project",
        color: PANTONE[6],
        desc: "Cross-platform full-stack migration to AWS at Publisher Agency",
        github: "",
        period: "May 2025 – Aug 2025",
        org: "Publisher Agency",
        fullDescription:
            "Led a cross-platform web migration to AWS infrastructure at Publisher Agency, rebuilding the existing system as a scalable full-stack application. The migration improved performance, reliability, and cost efficiency while modernizing the tech stack.",
        highlights: [
            "Architected and executed a full migration to AWS infrastructure including S3 and EC2",
            "Built full-stack solutions using Python, React, and TypeScript that improved performance and scalability",
            "Coordinated cross-platform compatibility across web and mobile targets",
            "Delivered production deployment within a 3-month internship timeline",
        ],
        tech: ["Python", "React", "TypeScript", "AWS S3", "AWS EC2", "Docker"],
    },
    {
        slug: "morgan-stanley-automation",
        showGithub: false,
        name: "Morgan Stanley Automation",
        tag: "Project",
        color: PANTONE[4],
        desc: "Client outreach automation — 200%+ efficiency gain on $750M+ portfolio",
        github: "",
        period: "May 2024 – Aug 2024",
        org: "Morgan Stanley",
        fullDescription:
            "Supported portfolio management operations for high-net-worth clients overseeing $750M+ in assets. Built automation tools using Python, C++, and Excel to streamline data preparation and client communication workflows, significantly reducing manual processing time.",
        highlights: [
            "Automated segmented client outreach workflows, improving communication efficiency by over 200%",
            "Built Python scripts and Excel automation to streamline data preparation for portfolio reporting",
            "Leveraged proprietary C++ software to process quarterly and annual client performance reviews, cutting manual processing time by 50%",
            "Supported reporting for high-net-worth clients managing $750M+ in combined assets",
        ],
        tech: ["Python", "C++", "Excel", "LaTeX", "Proprietary Internal Tools"],
    },
    {
        slug: "client-review-system",
        showGithub: false,
        showInGrid: true,
        name: "Client Review System",
        tag: "Project",
        color: { hex: "#D2362B", code: "18-1662 TCX", name: "Flame Scarlet" },
        desc: "C++ system for processing quarterly & annual client performance reviews at Morgan Stanley",
        github: "",
        period: "May 2024 – Aug 2024",
        org: "Morgan Stanley",
        fullDescription:
            "Built a client performance review processing system using proprietary C++ software at Morgan Stanley, automating the generation of quarterly and annual reports for high-net-worth clients. The system reduced manual processing time by 50% and improved reporting reliability across a $750M+ portfolio.",
        highlights: [
            "Leveraged proprietary C++ software to build an automated pipeline for quarterly and annual client performance reviews",
            "Reduced manual report processing time by 50% through automation of data extraction and formatting",
            "Integrated with existing portfolio management infrastructure supporting $750M+ in assets",
            "Ensured accuracy and compliance across all client-facing deliverables for high-net-worth accounts",
        ],
        tech: ["C++", "Python", "Proprietary Internal Tools", "Excel", "LaTeX"],
    },
    {
        slug: "genai-student-perception",
        name: "GenAI Student Perception",
        tag: "Research",
        color: PANTONE[11],
        desc: "Studying how university students perceive and interact with generative AI tools",
        github: "",
        showGithub: false,
        period: "Oct 2024 – Present",
        org: "Ruiz HCI Lab · University of Florida",
        fullDescription:
            "Conducting research on how university students perceive, adopt, and interact with generative AI tools in academic settings. The study explores trust, reliance, and ethical concerns through structured user studies and survey instruments.",
        highlights: [
            "Designed and deployed a full-stack web application for structured user interactions with generative AI systems",
            "Developed secure data collection pipeline compliant with IRB human subjects protocol",
            "Analyzing results across dimensions of trust, perceived usefulness, and ethical concern",
            "Contributing to a growing body of HCI research on human-AI interaction in educational contexts",
        ],
        tech: ["Python", "React", "TypeScript", "Flask", "R", "LaTeX"],
    },
    {
        slug: "llm-finetuning",
        name: "LLM Fine-Tuning",
        tag: "Project",
        color: PANTONE[12],
        desc: "LoRA/QLoRA fine-tuning of Mistral-7B as a course-specific AI tutor",
        github: "https://github.com/CBowers28/CIS6930-Final-Project",
        showGithub: true,
        showInGrid: true,
        period: "Fall 2025",
        org: "CIS6930 · University of Florida",
        fullDescription:
            "Led dataset integration and preprocessing for a parameter-efficient fine-tuning pipeline adapting Mistral-7B-Instruct into a course-specific AI tutor for UF's CIS6930 Large Language Models course. Used LoRA/QLoRA with a blended instruction corpus of UltraChat 200k, Infinity-Instruct, and Symbolic IT, trained on UF's HiPerGator cluster. The tuned model achieved a ~10% relative improvement in token-level F1 over the base model and demonstrated low perplexity on course slide reconstruction.",
        highlights: [
            "Led dataset integration combining UltraChat 200k, Infinity-Instruct, and Symbolic IT into a unified JSONL corpus with format standardization and deduplication",
            "Implemented core training pipelines using Hugging Face Transformers, PEFT, and TRL with LoRA rank r=64 across all attention and MLP projection layers",
            "Achieved ~10% relative improvement in mean token-level F1 (0.31 → 0.34) on a 400-example held-out instruction set",
            "Performed two-stage fine-tuning: general instruction tuning followed by CIS6930 lecture slide specialization, achieving perplexity of 4–8 on course material",
            "Trained on a single NVIDIA L4 GPU via UF's HiPerGator cluster using 4-bit NF4 quantization to fit within 24 GB VRAM",
        ],
        tech: ["Python", "PyTorch", "Hugging Face Transformers", "PEFT", "LoRA/QLoRA", "TRL", "BitsAndBytes", "Mistral-7B", "HiPerGator"],
    },
    {
        slug: "p2p-file-sharing",
        name: "P2P File Sharing",
        tag: "Project",
        color: PANTONE[13],
        desc: "BitTorrent-inspired peer-to-peer file sharing protocol in Python",
        github: "https://github.com/CBowers28/CNT5106C-Final-Project",
        showGithub: true,
        showInGrid: true,
        period: "Fall 2025",
        org: "CNT5106C · University of Florida",
        fullDescription:
            "Built a full BitTorrent-inspired peer-to-peer file sharing system from scratch in Python for CNT5106C (Computer Networks). The system implements the complete P2P protocol including TCP handshaking, bitfield-based piece tracking, choke/unchoke scheduling, and optimistic unchoking — supporting concurrent multi-peer file distribution across a simulated 6-node network.",
        highlights: [
            "Implemented the full P2P message protocol (CHOKE, UNCHOKE, INTERESTED, HAVE, BITFIELD, REQUEST, PIECE) over raw TCP sockets with framed length-prefixed messages",
            "Built a bitfield module tracking per-peer piece ownership; broadcasts HAVE to all active connections on piece completion",
            "Designed a preferred-neighbor scheduler that ranks peers by download rate and unchokes the top-k neighbors on a configurable interval",
            "Implemented optimistic unchoking to give randomly selected choked-but-interested peers a chance to receive data, preventing starvation",
            "Validated correctness via MD5 hash verification across all 5 downloading peers against a 20 MB reference file",
        ],
        tech: ["Python", "TCP Sockets", "Threading", "Bitfield Protocol", "P2P Networking"],
    },
    {
        slug: "portfolio-website",
        name: "Portfolio Website",
        tag: "Project",
        color: { hex: "#C9A84C", code: "16-0946 TCX", name: "Harvest Gold" },
        desc: "Pantone-themed personal portfolio built with Next.js & TypeScript",
        github: "https://github.com/CBowers28",
        showGithub: true,
        showInGrid: true,
        period: "Feb 2026",
        org: "Personal Project",
        fullDescription:
            "Designed and built a Pantone color swatch-themed personal portfolio from scratch using Next.js 15, TypeScript, and Tailwind CSS. The site features a cycling hero color chip, a horizontal transit map timeline of education and experience, a dynamic project grid, and a contact form that generates a unique Pantone color from the visitor's name.",
        highlights: [
            "Designed a Pantone-inspired aesthetic with custom typography (Bebas Neue, Cormorant Garamond, Space Mono) and a cycling hero color chip that transitions through 12 vivid colors every 30 seconds",
            "Built a horizontal transit map timeline using percentage-based positioning so tracks scale fluidly to any screen width",
            "Implemented a hash-based color generation function that derives a unique HSL Pantone swatch and color name from any visitor's name in real time",
            "Created dynamic project and experience detail pages using Next.js 15 App Router with typed data from a shared projects.ts library",
            "Integrated a contact form with Nodemailer/Gmail SMTP that sends a styled HTML email including the visitor's generated Pantone color chip",
        ],
        tech: ["Next.js 15", "TypeScript", "React", "Tailwind CSS", "Nodemailer", "Vercel"],
    },
];

export type Experience = {
    slug: string;
    company: string;
    role: string;
    period: string;
    location: string;
    color: { hex: string; code: string; name: string };
    summary: string;
    bullets: string[];
    tech: string[];
    relatedProjects: string[];
};

export const EXPERIENCE: Experience[] = [
    {
        slug: "morgan-stanley",
        company: "Morgan Stanley",
        role: "Software Engineering Intern",
        period: "May 2024 – Aug 2024",
        location: "Atlanta, GA",
        color: { hex: "#D2362B", code: "18-1662 TCX", name: "Flame Scarlet" },
        summary:
            "Supported portfolio management operations for high-net-worth clients overseeing $750M+ in assets, building automation tools that dramatically reduced manual processing time and improved client communication efficiency.",
        bullets: [
            "Automated segmented client outreach workflows, improving communication efficiency by over 200%",
            "Built Python scripts and Excel automation to streamline data preparation for portfolio reporting",
            "Leveraged proprietary C++ software to process quarterly and annual client performance reviews, cutting manual processing time by 50%",
            "Supported reporting for high-net-worth clients managing $750M+ in combined assets",
        ],
        tech: ["Python", "C++", "Excel", "LaTeX", "Proprietary Internal Tools"],
        relatedProjects: ["morgan-stanley-automation", "client-review-system"],
    },
    {
        slug: "publisher-agency",
        company: "Publisher Agency",
        role: "Developer Intern",
        period: "May 2025 – Aug 2025",
        location: "Remote",
        color: { hex: "#6B5070", code: "18-3513 TCX", name: "Grape Compote" },
        summary:
            "Led a cross-platform web migration to AWS infrastructure, rebuilding the existing system as a scalable full-stack application using modern cloud technologies.",
        bullets: [
            "Architected and executed a full migration to AWS infrastructure including S3 and EC2",
            "Built full-stack solutions with Python, React, and TypeScript that improved performance and scalability",
            "Coordinated cross-platform compatibility across web and mobile targets",
            "Delivered production deployment within a 3-month internship timeline",
        ],
        tech: ["Python", "React", "TypeScript", "AWS S3", "AWS EC2", "Docker"],
        relatedProjects: ["aws-web-migration"],
    },
    {
        slug: "algogators",
        company: "AlgoGators Investment Fund",
        role: "Lead Developer, Risk & Attribution",
        period: "Jan 2024 – Oct 2024",
        location: "Gainesville, FL",
        color: { hex: "#E8A820", code: "14-1064 TCX", name: "Saffron" },
        summary:
            "Led development of a risk management framework for UF's student-run algorithmic trading fund, designing stop-loss systems and leading a team of five analysts.",
        bullets: [
            "Designed stop-loss thresholds and drawdown limits using pandas and NumPy to protect fund capital",
            "Built automated performance alert systems that notified the team of risk events in real time",
            "Led a team of five analysts, reviewing and validating software before system integration",
            "Reduced integration defects and accelerated deployment by introducing code review workflows",
        ],
        tech: ["Python", "pandas", "NumPy", "Matplotlib", "Git", "SQL", "R", "C++"],
        relatedProjects: ["algogators-risk-framework"],
    },
    {
        slug: "ruiz-hci-lab",
        company: "Ruiz HCI Lab",
        role: "Undergraduate Researcher & Software Developer",
        period: "Oct 2024 – Present",
        location: "University of Florida",
        color: { hex: "#E07B39", code: "16-1359 TCX", name: "Orange Peel" },
        summary:
            "Conducting HCI research on eye-tracking, augmented reality, and AI perception. Leading software development for multiple active research projects including a NASA-funded fatigue detection study.",
        bullets: [
            "Developed eye-tracking software for a NASA project using OpenCV and ArUco markers to detect fighter pilot fatigue",
            "Led research on student perceptions of AI, building a full-stack web application with a secure IRB-compliant data pipeline",
            "Co-authored IEEE paper on uni- vs bi-directional gaze visualization in collocated AR using HoloLens 2",
            "Co-authored paper on companion agent self-disclosure levels and user perception",
        ],
        tech: ["Python", "OpenCV", "Unity", "HoloLens 2", "React", "Flask", "R", "LaTeX", "Pupil Labs"],
        relatedProjects: ["nasa-eye-tracking", "self-gaze-ar", "companion-agent-study", "genai-student-perception"],
    },
    {
        slug: "digital-markets-initiative",
        company: "Digital Markets Initiative",
        role: "Undergraduate Researcher & Software Developer",
        period: "Dec 2025 – Present",
        location: "University of Florida",
        color: { hex: "#1A6B7A", code: "18-4528 TCX", name: "Mosaic Blue" },
        summary:
            "Researching the economic and political impact of foundational AI models, building LLM pipelines on UF's HiPerGator supercomputer to analyze political sentiment at scale.",
        bullets: [
            "Built an LLM inference pipeline using API calls to UF's HiPerGator supercomputer for large-scale text analysis",
            "Implemented cosine similarity on sentence embeddings to cluster and classify political sentiment",
            "Contributing to ongoing research on the economic impact of foundational AI models",
        ],
        tech: ["Python", "Scikit-Learn", "TensorFlow", "Keras", "NumPy", "Pandas", "HiPerGator"],
        relatedProjects: ["llm-sentiment-analysis"],
    },
];