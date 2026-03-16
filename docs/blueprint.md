# **App Name**: BoardQuest

## Core Features:

- Gamified Student Dashboard: Visually represents subject mastery with progress bars, displays current level, XP, and daily study streaks, and integrates a dynamic leaderboard to foster social motivation.
- AI-Enhanced Spaced Repetition System: A daily practice module ('Learning Quest') that leverages AI to track user performance on questions, intelligently calculate optimal review intervals using Laravel's backend logic, and smoothly re-introduce previously challenging questions to maximize long-term retention.
- Adaptive Mock Examination Engine: Delivers high-stakes, timed mock exams featuring AI-synthesized situational questions fetched from the Laravel API, dynamically adjusting question difficulty in real-time based on the student's performance.
- Personalized AI Tutor Review: Immediately after mock exams, provides a detailed feedback screen where an AI tool generates personalized, logical explanations for why the correct answer is right and why the student's chosen answer was incorrect.
- Robust Data Persistence & Progress Tracking: Utilizes MongoDB for efficient storage and retrieval of user profiles, comprehensive XP logs, spaced repetition interval data, exam results, and other performance metrics, ensuring seamless syncing of all student data.

## Style Guidelines:

- Color Scheme: Light. Chosen for optimal readability and a focused learning environment, reflecting professionalism in academic review.
- Primary Color: Blue (#4CB3E6). Selected to convey trustworthiness, clarity, and a modern, digital aesthetic, aligning with scientific learning and a 'quest' for knowledge.
- Background Color: Light Gray-Blue (#EBF5F9). A very subtle, desaturated tint of the primary hue provides a calming, unobtrusive backdrop that enhances content readability and minimizes visual fatigue during study sessions.
- Accent Color: Cyan-Green (#1FA99A). This analogous hue provides a vibrant yet professional contrast for interactive elements, key indicators, and calls-to-action, effectively guiding user attention without being distracting.
- Headlines: 'Space Grotesk' (sans-serif) for a modern, slightly technical and academic feel that stands out. Body text: 'Inter' (sans-serif) for its neutral, objective, and highly readable qualities, suitable for questions, explanations, and long-form content.
- Use clear, concise icons that combine gamified elements (e.g., badges, stars, progress indicators) with professional medical and academic motifs (e.g., beakers, graduation caps, certificates) to reinforce the app's dual purpose.
- Adopt a clean, structured layout with a strong visual hierarchy, ensuring key information such as progress, current questions, and navigation is immediately accessible. Emphasize responsiveness for seamless experience across mobile and tablet devices, prioritizing legibility and interactive areas.
- Incorporate subtle, functional animations for feedback on correct/incorrect answers, smooth transitions between quiz questions, and dynamic updates to progress bars and leaderboard scores to enhance user engagement and provide immediate feedback without causing lag.