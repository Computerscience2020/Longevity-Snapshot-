// Longevity Snapshot Assessment Script

// Assessment domains and questions
const assessmentDomains = {
    welcome: {
        messages: [
            "Hi there! I'm your Longevity Snapshot Assistant. I'll be asking you a series of questions about your lifestyle habits to help assess factors that influence longevity and overall wellbeing.",
            "This assessment takes about 5-7 minutes to complete. Your responses will be used to calculate your personalized Longevity Score and provide tailored recommendations.",
            "Ready to begin the assessment?"
        ],
        nextDomain: "sleep"
    },
    sleep: {
        name: "Sleep Assessment",
        questions: [
            {
                question: "I'd like to start by understanding your sleep patterns. On a typical night, what time do you usually go to bed and wake up?",
                response: "Thanks for sharing. This helps me understand your sleep schedule."
            },
            {
                question: "On a scale from 1 to 10, how would you rate the quality of your sleep?",
                response: "Got it."
            },
            {
                question: "Do you follow any specific sleep habits or routines that help you sleep better?",
                response: "Thank you for sharing your sleep information."
            },
            {
                question: "Do you wake up during the night or have trouble falling asleep?",
                response: "I appreciate your honesty."
            }
        ],
        progress: 0,
        score: 0,
        completed: false,
        nextDomain: "stress"
    },
    stress: {
        name: "Stress Management Assessment",
        questions: [
            {
                question: "Let's talk about stress management in your life. What are the primary sources of stress in your daily life?",
                response: "Thank you for sharing that."
            },
            {
                question: "On a scale from 1 to 10, how would you rate your ability to cope with stress, with 10 being excellent?",
                response: "I understand."
            },
            {
                question: "Do you use meditation or mindfulness regularly to manage stress?",
                response: "That's helpful to know."
            },
            {
                question: "How often do you dedicate time for relaxation or stress relief each week?",
                response: "Thank you for sharing your approach to stress management."
            }
        ],
        progress: 0,
        score: 0,
        completed: false,
        nextDomain: "physical"
    },
    physical: {
        name: "Physical Activity Assessment",
        questions: [
            {
                question: "Let's talk about your physical activity patterns. In a typical week, how many days do you engage in intentional exercise or physical activity?",
                response: "Thanks for sharing."
            },
            {
                question: "What types of physical activities do you enjoy?",
                response: "That gives me a good starting point."
            },
            {
                question: "On days when you exercise, approximately how long do you typically spend being active?",
                response: "I appreciate the detail."
            },
            {
                question: "Outside of planned exercise, how other would you say your daily lifestyle is (sitting, standing, walking, etc.)?",
                response: "Thank you for sharing your physical activity information."
            }
        ],
        progress: 0,
        score: 0,
        completed: false,
        nextDomain: "nutrition"
    },
    nutrition: {
        name: "Nutrition Assessment",
        questions: [
            {
                question: "Let's explore your nutrition patterns. Could you describe what you might eat and drink during a typical day?",
                response: "Thanks for sharing that overview."
            },
            {
                question: "How many servings of fruits and vegetables do you typically consume each day?",
                response: "I appreciate your honest response."
            },
            {
                question: "How often do you consume processed foods, fast food, or takeout meals in a typical week?",
                response: "Thanks for sharing."
            },
            {
                question: "Do you follow any specific dietary approach or have food restrictions?",
                response: "Thank you for sharing your nutrition information."
            }
        ],
        progress: 0,
        score: 0,
        completed: false,
        nextDomain: "social"
    },
    social: {
        name: "Social Connections Assessment",
        questions: [
            {
                question: "Finally, let's talk about your social connections. How often do you spend quality time with friends, family, or other people you care about?",
                response: "Thanks for sharing."
            },
            {
                question: "Do you feel you have people you can count on when you need support?",
                response: "I appreciate your openness."
            },
            {
                question: "On a scale from 1 to 10, how satisfied are you with the quality of your social relationships?",
                response: "Thank you for sharing that."
            },
            {
                question: "Are you part of any clubs, groups, or organizations that give you a sense of belonging?",
                response: "Thank you for completing all the questions about your social connections."
            }
        ],
        progress: 0,
        score: 0,
        completed: false,
        nextDomain: "results"
    }
};

// Assessment state
const assessmentState = {
    currentDomain: "welcome",
    currentQuestionIndex: 0,
    responses: {},
    domainScores: {
        sleep: 0,
        stress: 0,
        physical: 0,
        nutrition: 0,
        social: 0
    },
    completed: false,
    inFollowUp: false,
    followUpDomain: null,
    followUpRecommendation: null,
    scheduledReassessment: false
};

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userMessageInput = document.getElementById('user-message');
const sendButton = document.getElementById('send-button');
const resultsContainer = document.getElementById('results-container');

// Progress bars
const progressBars = {
    sleep: document.getElementById('sleep-progress'),
    stress: document.getElementById('stress-progress'),
    physical: document.getElementById('physical-progress'),
    nutrition: document.getElementById('nutrition-progress'),
    social: document.getElementById('social-progress')
};

// Initialize the assessment
function initializeAssessment() {
    // Display welcome message
    const welcomeMessages = assessmentDomains.welcome.messages;
    
    // Add a slight delay for each welcome message
    welcomeMessages.forEach((message, index) => {
        setTimeout(() => {
            addMessage(message, 'assistant');
        }, index * 1000);
    });

    // Set up event listeners
    sendButton.addEventListener('click', handleUserResponse);
    userMessageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserResponse();
        }
    });
}

// Add a message to the chat
function addMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Detailed follow-up information for each domain
const domainFollowUpInfo = {
    sleep: {
        "consistent schedule": {
            info: "Maintaining a consistent sleep schedule helps regulate your body's internal clock (circadian rhythm). Going to bed and waking up at the same time every day—even on weekends—reinforces your body's sleep-wake cycle and can help you fall asleep and wake up more easily.",
            tips: "Start by setting a consistent bedtime that allows for 7-9 hours of sleep. Use a bedtime reminder on your phone 30 minutes before your target bedtime. If you can't fall asleep within 20 minutes, get up and do something relaxing until you feel tired."
        },
        "bedtime routine": {
            info: "A relaxing bedtime routine signals to your brain that it's time to wind down and prepare for sleep. The routine should include calming activities and avoid screens, which emit blue light that can interfere with melatonin production.",
            tips: "Create a 30-minute pre-sleep routine that might include: reading a physical book, gentle stretching, taking a warm bath or shower, practicing deep breathing, or listening to calming music. Keep your routine consistent each night."
        },
        "sleep environment": {
            info: "Your sleep environment significantly impacts sleep quality. The ideal sleeping environment is cool (65-67°F/18-19°C), completely dark, and quiet. Your mattress and pillows should properly support your body.",
            tips: "Use blackout curtains or an eye mask to block light. Consider earplugs or a white noise machine for noise control. Evaluate your mattress and pillows—they should be comfortable and supportive. Remove electronic devices from your bedroom."
        },
        "caffeine and alcohol": {
            info: "Caffeine is a stimulant that can remain in your system for 6+ hours and interfere with falling asleep. Alcohol might help you fall asleep initially but disrupts your sleep cycle and reduces sleep quality.",
            tips: "Avoid caffeine after noon, including coffee, tea, chocolate, and some medications. Limit alcohol consumption, especially within 3 hours of bedtime. If you do consume alcohol, drink plenty of water to stay hydrated."
        },
        "meditation": {
            info: "Pre-sleep meditation helps calm an active mind, reduce stress, and prepare your body for sleep. Even 5 minutes can significantly improve sleep quality by activating your parasympathetic nervous system.",
            tips: "Try a simple breathing meditation: Lie in bed, close your eyes, and focus on your breath. Count each inhale and exhale as one breath, up to 10, then start over. If your mind wanders, gently bring it back to your breath without judgment."
        }
    },
    stress: {
        "mindfulness": {
            info: "Mindfulness practice helps you stay present and observe thoughts and feelings without judgment. Regular practice can reduce stress reactivity and improve emotional regulation.",
            tips: "Start with just 5 minutes daily using a guided meditation app. Find a quiet place, sit comfortably, and focus on your breathing. When your mind wanders (which is normal), gently bring your attention back to your breath."
        },
        "stress triggers": {
            info: "Identifying specific stress triggers allows you to develop targeted coping strategies rather than using a one-size-fits-all approach. This personalized approach is more effective for stress management.",
            tips: "Keep a stress journal for one week. Note when you feel stressed, what triggered it, your physical sensations, thoughts, and how you responded. Review to identify patterns, then create a specific action plan for your top 3 triggers."
        },
        "worry time": {
            info: "The 'designated worry time' technique helps contain anxious thoughts to a specific time period rather than letting them intrude throughout your day. This helps reduce overall anxiety and improves focus.",
            tips: "Schedule 15-20 minutes daily as your 'worry time.' When worries arise outside this time, note them down and postpone thinking about them until your designated time. During worry time, problem-solve what you can and practice acceptance for what you can't control."
        },
        "work-life boundaries": {
            info: "Clear boundaries between work and personal life prevent work stress from spilling into your relaxation time. Transition rituals help your brain switch contexts and reduce stress carryover.",
            tips: "Create a specific end-of-work ritual, such as writing tomorrow's to-do list, changing clothes, or taking a short walk. Set specific work hours and communicate them to colleagues. Keep work devices out of your bedroom."
        },
        "box breathing": {
            info: "Box breathing (4-7-8 technique) activates your parasympathetic nervous system, which controls your relaxation response. It quickly reduces stress hormones and helps you regain calm.",
            tips: "Practice twice daily: Inhale through your nose for 4 counts, hold for 7 counts, exhale slowly through your mouth for 8 counts. Repeat 4 times. Place one hand on your chest and one on your stomach to ensure you're breathing deeply."
        }
    },
    physical: {
        "daily walk": {
            info: "A daily 10-minute walk is an accessible starting point for building physical activity into your routine. Walking improves cardiovascular health, mood, and energy levels while being low-impact and requiring no special equipment.",
            tips: "Choose the same time each day to build consistency, such as after breakfast or during lunch. Start with a comfortable pace and distance. Use comfortable shoes and weather-appropriate clothing. Consider listening to music, podcasts, or audiobooks to make it more enjoyable."
        },
        "accountability": {
            info: "Accountability partners significantly increase exercise adherence. Having someone expecting you to show up creates external motivation when internal motivation might be lacking.",
            tips: "Choose someone with similar fitness goals or schedule. Set specific days and times to exercise together. If meeting in person isn't possible, use text check-ins before and after workouts, or share activity tracker results. Consider a friendly competition or shared goal."
        },
        "strength training": {
            info: "Strength training preserves and builds muscle mass, which naturally declines with age. It improves metabolism, bone density, functional strength for daily activities, and helps prevent injuries.",
            tips: "Start with bodyweight exercises twice weekly: squats, modified push-ups, lunges, and planks. Begin with 2 sets of 8-12 repetitions. Focus on proper form rather than quantity. As these become easier, gradually add resistance with household items, resistance bands, or light dumbbells."
        },
        "activity variety": {
            info: "Varying your activities works different muscle groups, prevents overuse injuries, reduces exercise boredom, and improves overall fitness by challenging your body in different ways.",
            tips: "Try a new activity that interests you—dancing, swimming, cycling, hiking, yoga, or a fitness class. Look for free trial classes or videos online. Schedule different activities on different days of the week. Focus on enjoyment rather than performance when trying something new."
        },
        "active breaks": {
            info: "Short movement breaks throughout the day counteract the negative effects of prolonged sitting, boost energy and focus, improve circulation, and add to your overall physical activity without requiring a significant time commitment.",
            tips: "Set a timer to move for 2-5 minutes every hour. Simple options include: walking up and down stairs, doing 10 squats or lunges, stretching, or marching in place. Keep a list of quick exercises visible at your workspace as a reminder."
        }
    },
    nutrition: {
        "vegetables": {
            info: "Adding vegetables to each meal increases your intake of essential vitamins, minerals, and fiber while naturally reducing consumption of less nutritious foods. This approach focuses on addition rather than restriction, making it more sustainable.",
            tips: "Start by adding one vegetable to each meal, even breakfast (like spinach in eggs or smoothies). Keep pre-cut vegetables ready for easy addition to meals. Try roasting vegetables with olive oil and herbs to enhance flavor. Gradually increase portions until vegetables fill half your plate."
        },
        "meal timing": {
            info: "Consistent meal timing helps regulate hunger hormones, blood sugar, and metabolism. It prevents extreme hunger that can lead to poor food choices and overeating.",
            tips: "Establish a regular eating schedule with 3 meals and 1-2 planned snacks if needed. Try to eat meals within the same 30-minute window each day. Plan meals ahead to ensure they happen at consistent times. Don't skip meals, especially breakfast."
        },
        "meal planning": {
            info: "Meal planning increases awareness of eating patterns without judgment and helps you make intentional food choices rather than reactive ones. It reduces decision fatigue and improves overall diet quality.",
            tips: "Start with planning just 3-4 dinners per week. Create a simple template with protein, vegetables, and whole grains for each meal. Make a shopping list based on your plan. Prepare components in advance when possible. Be flexible and adjust as needed."
        },
        "hydration": {
            info: "Proper hydration supports all bodily functions, helps control hunger (which is often confused with thirst), improves energy and cognitive function, and supports cellular health and detoxification processes.",
            tips: "Keep a reusable water bottle with you throughout the day. Drink a glass of water first thing in the morning and before each meal. Set specific hydration goals based on your body weight (typically 0.5-1 oz per pound of body weight). Add natural flavors like lemon, cucumber, or berries if plain water is unappealing."
        },
        "plant proteins": {
            info: "Plant-based protein sources provide not only protein but also fiber, antioxidants, and phytonutrients that animal proteins lack. They're associated with reduced inflammation and lower risk of chronic diseases.",
            tips: "Start by replacing animal protein with plant protein in 2-3 meals per week. Easy options include beans, lentils, tofu, tempeh, and edamame. Try bean-based pastas or add nuts and seeds to salads and cereals. Use plant proteins in familiar dishes like chili, stir-fries, or tacos."
        }
    },
    social: {
        "regular check-ins": {
            info: "Regular social check-ins maintain and strengthen relationships over time. Consistent connection, even brief, builds social bonds that provide emotional support and contribute to overall wellbeing.",
            tips: "Identify 3-5 key people in your life for regular check-ins. Schedule recurring reminders in your calendar for different people. Keep check-ins simple—a text, quick call, or video chat. Ask meaningful questions beyond 'How are you?' such as 'What's been bringing you joy lately?'"
        },
        "interest groups": {
            info: "Interest-based groups provide social connection with built-in conversation topics and shared activities. They offer opportunities to develop friendships based on common ground in a structured environment.",
            tips: "Identify a hobby or interest you enjoy or want to explore. Search for related groups on platforms like Meetup.com, Facebook Groups, or community center listings. Start with online groups if in-person feels intimidating. Commit to attending at least 3 meetings before deciding if it's a good fit."
        },
        "daily interactions": {
            info: "Brief social interactions with acquaintances or community members contribute significantly to social wellbeing. These 'weak ties' provide a sense of community belonging and can improve mood and social confidence.",
            tips: "Initiate brief conversations with people you encounter regularly—baristas, neighbors, store clerks. Ask a simple question beyond the transaction or comment on something positive. Make eye contact and use the person's name if possible. Express genuine appreciation for their service."
        },
        "meaningful conversations": {
            info: "Deep conversations strengthen relationships more effectively than small talk. They create intimacy, mutual understanding, and stronger social bonds while providing opportunities for personal growth and perspective-taking.",
            tips: "Prepare a few thoughtful questions beyond surface topics, such as: 'What are you looking forward to right now?' or 'What's something you've changed your mind about recently?' Listen actively without planning your response. Follow up on what the person shares rather than shifting to your own experience."
        },
        "social rituals": {
            info: "Regular social rituals create anticipation and reliable connection in busy lives. They provide structure for social interaction and become meaningful traditions that strengthen relationships over time.",
            tips: "Start with a monthly commitment that's sustainable for your schedule. Choose an activity everyone enjoys—a meal, game night, walk, or video call. Set a recurring date (e.g., first Sunday of each month) and communicate it clearly. Keep the format simple and consistent while allowing for some variation in content."
        }
    }
};

// Fallback responses for the main assessment
const assessmentFallbacks = [
    "I'm not sure I understood your response. Could you please provide a bit more detail?",
    "To give you the most accurate assessment, I need to understand your response better. Could you rephrase that?",
    "I want to make sure I'm capturing your information correctly. Could you elaborate on your answer?",
    "For this assessment to be most helpful, I need clear responses. Could you share a bit more about your habits in this area?"
];

// Handle user response
function handleUserResponse() {
    const userMessage = userMessageInput.value.trim();
    
    if (userMessage === '') return;
    
    // Add user message to chat
    addMessage(userMessage, 'user');
    userMessageInput.value = '';
    
    // Check if assessment is completed and handling follow-up
    if (assessmentState.completed) {
        handleFollowUpResponse(userMessage);
        return;
    }
    
    // Check for extremely short or unclear responses during assessment
    if (assessmentState.currentDomain !== 'welcome' && 
        (userMessage.length < 2 || /^[^a-zA-Z0-9]+$/.test(userMessage))) {
        // Response is too short or contains only special characters
        const randomFallback = assessmentFallbacks[Math.floor(Math.random() * assessmentFallbacks.length)];
        
        setTimeout(() => {
            addMessage(randomFallback, 'assistant');
        }, 500);
        
        return; // Don't proceed to next question
    }
    
    // Store response
    if (assessmentState.currentDomain !== 'welcome') {
        if (!assessmentState.responses[assessmentState.currentDomain]) {
            assessmentState.responses[assessmentState.currentDomain] = [];
        }
        
        assessmentState.responses[assessmentState.currentDomain].push(userMessage);
        
        // Update domain progress
        const domain = assessmentDomains[assessmentState.currentDomain];
        domain.progress = ((assessmentState.currentQuestionIndex + 1) / domain.questions.length) * 100;
        updateProgressBar(assessmentState.currentDomain, domain.progress);
        
        // Add assistant response
        const responseText = domain.questions[assessmentState.currentQuestionIndex].response;
        setTimeout(() => {
            addMessage(responseText, 'assistant');
        }, 500);
        
        // Calculate preliminary score for the question (will be refined later)
        calculateQuestionScore(userMessage, assessmentState.currentDomain, assessmentState.currentQuestionIndex);
    }
    
    // Move to next question or domain
    setTimeout(() => {
        moveToNextQuestion();
    }, 1000);
}

// Handle follow-up responses after assessment completion
function handleFollowUpResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check if user wants more information about a specific domain
    const domainKeywords = {
        sleep: ['sleep', 'bed', 'night', 'rest', 'insomnia', 'tired'],
        stress: ['stress', 'anxiety', 'worry', 'tension', 'relax', 'calm'],
        physical: ['exercise', 'activity', 'workout', 'fitness', 'strength', 'walk'],
        nutrition: ['food', 'eat', 'diet', 'nutrition', 'meal', 'vegetable'],
        social: ['social', 'friend', 'family', 'connection', 'relationship', 'people']
    };
    
    // Check if user is asking about reassessment
    if (lowerMessage.includes('reassess') || lowerMessage.includes('schedule') || 
        lowerMessage.includes('check-in') || lowerMessage.includes('again') || 
        lowerMessage.includes('another') || lowerMessage.includes('track progress')) {
        
        scheduleReassessment();
        return;
    }
    
    // Check if user is saying goodbye or indicating they're done
    if (lowerMessage.includes('bye') || lowerMessage.includes('thank') || 
        lowerMessage.includes('done') || lowerMessage.includes('finished') || 
        lowerMessage.includes('exit') || lowerMessage.includes('quit')) {
        
        provideExitMessage();
        return;
    }
    
    // Check for domain-specific follow-up
    let matchedDomain = null;
    let highestMatchCount = 0;
    
    Object.entries(domainKeywords).forEach(([domain, keywords]) => {
        const matchCount = keywords.filter(keyword => lowerMessage.includes(keyword)).length;
        if (matchCount > highestMatchCount) {
            highestMatchCount = matchCount;
            matchedDomain = domain;
        }
    });
    
    // Check for specific recommendation topics within the matched domain
    if (matchedDomain && highestMatchCount > 0) {
        const domainInfo = domainFollowUpInfo[matchedDomain];
        let matchedTopic = null;
        
        // Find the most relevant topic in the domain
        Object.keys(domainInfo).forEach(topic => {
            if (lowerMessage.includes(topic)) {
                matchedTopic = topic;
            }
        });
        
        if (matchedTopic) {
            // Provide specific information about the topic
            const topicInfo = domainInfo[matchedTopic];
            
            setTimeout(() => {
                addMessage(`Thank you for your interest in improving your ${matchedDomain} health. Here's more detailed information about ${matchedTopic}:`, 'assistant');
                
                setTimeout(() => {
                    addMessage(topicInfo.info, 'assistant');
                    
                    setTimeout(() => {
                        addMessage(`Would you like specific tips on how to implement this into your routine?`, 'assistant');
                        
                        // Set up state for implementation tips
                        assessmentState.inFollowUp = true;
                        assessmentState.followUpDomain = matchedDomain;
                        assessmentState.followUpRecommendation = matchedTopic;
                    }, 1000);
                }, 1500);
            }, 1000);
            
            return;
        }
        
        // If no specific topic matched but domain matched, provide general info
        setTimeout(() => {
            addMessage(`I see you're interested in improving your ${matchedDomain} health. Is there a specific recommendation you'd like more information about?`, 'assistant');
        }, 1000);
        
        return;
    }
    
    // Check if user wants implementation tips for a previously discussed topic
    if (assessmentState.inFollowUp && 
        (lowerMessage.includes('yes') || lowerMessage.includes('sure') || 
         lowerMessage.includes('please') || lowerMessage.includes('tips') || 
         lowerMessage.includes('how'))) {
        
        const domain = assessmentState.followUpDomain;
        const topic = assessmentState.followUpRecommendation;
        
        if (domain && topic && domainFollowUpInfo[domain][topic]) {
            const implementationTips = domainFollowUpInfo[domain][topic].tips;
            
            setTimeout(() => {
                addMessage(`Here are some practical tips for implementing this into your routine:`, 'assistant');
                
                setTimeout(() => {
                    addMessage(implementationTips, 'assistant');
                    
                    setTimeout(() => {
                        addMessage(`Is there anything else you'd like to know about your assessment results or recommendations?`, 'assistant');
                        
                        // Reset follow-up state
                        assessmentState.inFollowUp = false;
                        assessmentState.followUpDomain = null;
                        assessmentState.followUpRecommendation = null;
                    }, 1000);
                }, 1500);
            }, 1000);
            
            return;
        }
    }
    
    // Default response if no specific intent is matched
    setTimeout(() => {
        // Use fallback responses with some variety
        const fallbackResponses = [
            "I'm here to help you understand your assessment results and recommendations. You can ask about specific domains like sleep, stress management, physical activity, nutrition, or social connections. Or, if you're ready to finish, just let me know.",
            "I'm here to help with your Longevity Snapshot Assessment, but I didn't quite understand your response. Could you please rephrase that? Remember, I'm collecting information about your health habits to provide personalized recommendations.",
            "I want to make sure I'm providing the most helpful information. Could you clarify what you'd like to know about your assessment results or recommendations? You can ask about specific domains or implementation tips.",
            "I'm not sure I understood your question. You can ask me about your scores in specific domains, details about recommendations, or how to implement changes. What would you like to know more about?"
        ];
        
        // Select a random fallback response
        const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
        addMessage(fallbackResponses[randomIndex], 'assistant');
    }, 1000);
}

// Move to the next question or domain
function moveToNextQuestion() {
    if (assessmentState.currentDomain === 'welcome') {
        // Move from welcome to first domain
        assessmentState.currentDomain = assessmentDomains.welcome.nextDomain;
        assessmentState.currentQuestionIndex = 0;
        askCurrentQuestion();
    } else {
        const currentDomain = assessmentDomains[assessmentState.currentDomain];
        
        // Check if there are more questions in the current domain
        if (assessmentState.currentQuestionIndex < currentDomain.questions.length - 1) {
            // Move to next question in current domain
            assessmentState.currentQuestionIndex++;
            askCurrentQuestion();
        } else {
            // Mark domain as completed
            currentDomain.completed = true;
            
            // Calculate final domain score
            finalizeDomainScore(assessmentState.currentDomain);
            
            // Check if all domains are completed
            if (currentDomain.nextDomain === 'results') {
                // Assessment completed
                assessmentState.completed = true;
                showResults();
            } else {
                // Move to next domain
                assessmentState.currentDomain = currentDomain.nextDomain;
                assessmentState.currentQuestionIndex = 0;
                
                // Add transition message
                setTimeout(() => {
                    const nextDomainName = assessmentDomains[assessmentState.currentDomain].name;
                    addMessage(`Let's move on to talk about ${assessmentDomains[assessmentState.currentDomain].name.toLowerCase()}.`, 'assistant');
                    
                    // Ask first question of new domain after a delay
                    setTimeout(() => {
                        askCurrentQuestion();
                    }, 1000);
                }, 1000);
            }
        }
    }
}

// Ask the current question
function askCurrentQuestion() {
    const currentDomain = assessmentDomains[assessmentState.currentDomain];
    const currentQuestion = currentDomain.questions[assessmentState.currentQuestionIndex];
    
    addMessage(currentQuestion.question, 'assistant');
}

// Update progress bar
function updateProgressBar(domain, progress) {
    progressBars[domain].style.width = `${progress}%`;
}

// Calculate score for a question based on user response
function calculateQuestionScore(response, domain, questionIndex) {
    let score = 0;
    
    // This is a simplified scoring algorithm
    // In a real application, you would implement more sophisticated analysis
    
    switch (domain) {
        case 'sleep':
            if (questionIndex === 1) { // Sleep quality rating
                // Extract numeric rating if present
                const rating = extractNumberFromString(response);
                if (rating !== null) {
                    score = rating;
                }
            } else if (questionIndex === 2) { // Sleep habits
                // Check for positive sleep habits
                if (response.toLowerCase().includes('routine') || 
                    response.toLowerCase().includes('regular') ||
                    response.toLowerCase().includes('read') ||
                    response.toLowerCase().includes('meditat')) {
                    score = 8;
                } else {
                    score = 5;
                }
            } else if (questionIndex === 3) { // Sleep issues
                // Check for sleep issues
                if (response.toLowerCase().includes('no') || 
                    response.toLowerCase().includes("don't") ||
                    response.toLowerCase().includes('rarely')) {
                    score = 9;
                } else {
                    score = 4;
                }
            } else {
                score = 5; // Default middle score
            }
            break;
            
        case 'stress':
            if (questionIndex === 1) { // Stress coping rating
                const rating = extractNumberFromString(response);
                if (rating !== null) {
                    score = rating;
                }
            } else if (questionIndex === 2) { // Meditation/mindfulness
                if (response.toLowerCase().includes('yes') || 
                    response.toLowerCase().includes('meditat') ||
                    response.toLowerCase().includes('mindful')) {
                    score = 9;
                } else {
                    score = 4;
                }
            } else if (questionIndex === 3) { // Relaxation time
                if (response.toLowerCase().includes('daily') || 
                    response.toLowerCase().includes('every day') ||
                    response.toLowerCase().includes('regularly')) {
                    score = 9;
                } else if (response.toLowerCase().includes('never') ||
                           response.toLowerCase().includes('rarely')) {
                    score = 3;
                } else {
                    score = 6;
                }
            } else {
                score = 5;
            }
            break;
            
        // Similar patterns for other domains
        case 'physical':
            if (questionIndex === 0) { // Days of exercise
                const days = extractNumberFromString(response);
                if (days !== null) {
                    score = Math.min(days * 1.5, 10);
                }
            } else if (questionIndex === 2) { // Duration
                if (response.toLowerCase().includes('hour') || 
                    response.toLowerCase().includes('60') ||
                    response.toLowerCase().includes('90')) {
                    score = 9;
                } else if (response.toLowerCase().includes('30') ||
                           response.toLowerCase().includes('half')) {
                    score = 7;
                } else if (response.toLowerCase().includes('10') ||
                           response.toLowerCase().includes('15') ||
                           response.toLowerCase().includes('few')) {
                    score = 4;
                } else {
                    score = 5;
                }
            } else {
                score = 5;
            }
            break;
            
        case 'nutrition':
            if (questionIndex === 1) { // Fruit and vegetable servings
                const servings = extractNumberFromString(response);
                if (servings !== null) {
                    score = Math.min(servings * 2, 10);
                }
            } else if (questionIndex === 2) { // Processed food
                if (response.toLowerCase().includes('never') || 
                    response.toLowerCase().includes('rarely')) {
                    score = 9;
                } else if (response.toLowerCase().includes('daily') ||
                           response.toLowerCase().includes('often')) {
                    score = 3;
                } else {
                    score = 6;
                }
            } else {
                score = 5;
            }
            break;
            
        case 'social':
            if (questionIndex === 1) { // Support network
                if (response.toLowerCase().includes('yes') || 
                    response.toLowerCase().includes('definitely')) {
                    score = 9;
                } else if (response.toLowerCase().includes('no') ||
                           response.toLowerCase().includes('not really')) {
                    score = 3;
                } else {
                    score = 5;
                }
            } else if (questionIndex === 2) { // Relationship satisfaction
                const rating = extractNumberFromString(response);
                if (rating !== null) {
                    score = rating;
                }
            } else {
                score = 5;
            }
            break;
            
        default:
            score = 5;
    }
    
    // Store the score
    assessmentDomains[domain].score += score;
}

// Finalize domain score
function finalizeDomainScore(domain) {
    const questions = assessmentDomains[domain].questions;
    const rawScore = assessmentDomains[domain].score;
    
    // Calculate average score for the domain (on a 0-10 scale)
    const averageScore = rawScore / questions.length;
    
    // Store in assessment state
    assessmentState.domainScores[domain] = Math.round(averageScore);
}

// Extract number from string
function extractNumberFromString(str) {
    const matches = str.match(/\d+/);
    if (matches && matches.length > 0) {
        const num = parseInt(matches[0]);
        if (!isNaN(num) && num >= 0 && num <= 10) {
            return num;
        }
    }
    return null;
}

// Show results
function showResults() {
    // Add final message
    addMessage("Thank you for completing the Longevity Snapshot Assessment! I've analyzed your responses and prepared your personalized results.", 'assistant');
    
    // Calculate overall score
    const scores = assessmentState.domainScores;
    const overallScore = Math.round((scores.sleep + scores.stress + scores.physical + scores.nutrition + scores.social) / 5);
    
    // Find lowest scoring domains
    const domainScores = Object.entries(scores).sort((a, b) => a[1] - b[1]);
    const lowestDomains = domainScores.slice(0, 3);
    
    // Generate recommendations
    const recommendations = generateRecommendations(lowestDomains);
    
    // Display results
    setTimeout(() => {
        // Show results container
        resultsContainer.style.display = 'block';
        
        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Create chart
        createResultsChart(scores);
        
        // Display domain scores
        displayDomainScores(scores);
        
        // Add recommendations
        const recommendationsList = document.getElementById('recommendations-list');
        recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            recommendationsList.appendChild(li);
        });
        
        // Add final message
        addMessage(`Your overall Longevity Score is ${overallScore}/10. I've provided personalized recommendations to help improve your score in the areas that need the most attention.`, 'assistant');
        
        // Mark assessment as completed
        assessmentState.completed = true;
        
        // Prompt for follow-up questions
        setTimeout(() => {
            addMessage(`You can ask me for more detailed information about any of the recommendations, or if you're ready to finish, let me know.`, 'assistant');
        }, 2000);
    }, 1500);
}

// Provide exit message when user is done
function provideExitMessage() {
    setTimeout(() => {
        addMessage(`Thank you for completing the Longevity Snapshot Assessment! You can implement these recommendations at your own pace. For best results, focus on one recommendation at a time and build consistent habits.`, 'assistant');
        
        if (!assessmentState.scheduledReassessment) {
            setTimeout(() => {
                addMessage(`Would you like to schedule a reassessment in 4-6 weeks to track your progress? Many people find that regular check-ins help them stay motivated and see how their lifestyle changes are affecting their overall longevity score.`, 'assistant');
            }, 1500);
        } else {
            setTimeout(() => {
                addMessage(`I look forward to your reassessment in 4-6 weeks. Take care until then!`, 'assistant');
            }, 1500);
        }
    }, 1000);
}

// Schedule reassessment
function scheduleReassessment() {
    // Get current date
    const currentDate = new Date();
    
    // Add 4-6 weeks (randomly choose between 28-42 days)
    const daysToAdd = Math.floor(Math.random() * (42 - 28 + 1)) + 28;
    const reassessmentDate = new Date(currentDate);
    reassessmentDate.setDate(reassessmentDate.getDate() + daysToAdd);
    
    // Format the date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = reassessmentDate.toLocaleDateString('en-US', options);
    
    // Mark as scheduled
    assessmentState.scheduledReassessment = true;
    
    setTimeout(() => {
        addMessage(`Great! I've scheduled your reassessment for ${formattedDate}. I'll send you a reminder as we get closer to that date.`, 'assistant');
        
        setTimeout(() => {
            addMessage(`In the meantime, focus on implementing one recommendation at a time. Small, consistent changes are more effective than trying to change everything at once.`, 'assistant');
            
            setTimeout(() => {
                addMessage(`Is there anything specific you'd like to know about your recommendations before we wrap up?`, 'assistant');
            }, 1500);
        }, 1500);
    }, 1000);
}

// Display domain scores with descriptions
function displayDomainScores(scores) {
    const domainScoreGrid = document.getElementById('domain-score-grid');
    const domainNames = {
        sleep: "Sleep",
        stress: "Stress Management",
        physical: "Physical Activity",
        nutrition: "Nutrition",
        social: "Social Connections"
    };
    
    const domainDescriptions = {
        sleep: {
            low: "Your sleep patterns may be affecting your overall wellbeing. Improving sleep quality and consistency can have significant benefits for your health.",
            medium: "You have established some good sleep habits, but there's room for improvement in your sleep quality or consistency.",
            high: "You have excellent sleep habits that support your overall health and longevity."
        },
        stress: {
            low: "Your stress management strategies may need strengthening to better support your wellbeing and longevity.",
            medium: "You have some effective stress management techniques in place, but could benefit from additional strategies.",
            high: "You have strong stress management practices that effectively support your wellbeing."
        },
        physical: {
            low: "Increasing your physical activity levels would significantly benefit your longevity and overall health.",
            medium: "You have established some good physical activity habits, but could benefit from more consistency or variety.",
            high: "Your physical activity habits strongly support your health and longevity."
        },
        nutrition: {
            low: "Your nutritional choices present an opportunity to significantly improve your health and longevity.",
            medium: "You have some healthy nutritional habits, but could benefit from more consistent healthy eating patterns.",
            high: "Your nutritional choices strongly support your health and longevity."
        },
        social: {
            low: "Strengthening your social connections would provide significant benefits for your wellbeing and longevity.",
            medium: "You have established some meaningful social connections, but could benefit from deepening or expanding your social network.",
            high: "Your social connections provide strong support for your emotional wellbeing and longevity."
        }
    };
    
    // Clear any existing content
    domainScoreGrid.innerHTML = '';
    
    // Create a card for each domain
    Object.entries(scores).forEach(([domain, score]) => {
        // Convert score to 0-20 scale for category determination
        const scaledScore = score * 2;
        
        // Determine score category
        let scoreCategory;
        if (scaledScore <= 7) {
            scoreCategory = "low";
        } else if (scaledScore <= 14) {
            scoreCategory = "medium";
        } else {
            scoreCategory = "high";
        }
        
        // Create domain score card
        const card = document.createElement('div');
        card.className = 'domain-score-card';
        
        // Add domain name and score
        const heading = document.createElement('h4');
        heading.innerHTML = `${domainNames[domain]} <span class="score-badge">${score}/10</span>`;
        card.appendChild(heading);
        
        // Add score category
        const category = document.createElement('span');
        category.className = `score-category ${scoreCategory}`;
        category.textContent = scoreCategory.charAt(0).toUpperCase() + scoreCategory.slice(1);
        card.appendChild(category);
        
        // Add description
        const description = document.createElement('p');
        description.textContent = domainDescriptions[domain][scoreCategory];
        card.appendChild(description);
        
        // Add card to grid
        domainScoreGrid.appendChild(card);
    });
}

// Generate recommendations based on lowest scoring domains
function generateRecommendations(lowestDomains) {
    const recommendations = [];
    
    lowestDomains.forEach(([domain, score]) => {
        let recommendation = "";
        
        // Convert score to 0-20 scale for template matching
        const scaledScore = Math.round(score * 2);
        
        // Determine score category
        let scoreCategory;
        if (scaledScore <= 7) {
            scoreCategory = "low";
        } else if (scaledScore <= 14) {
            scoreCategory = "medium";
        } else {
            scoreCategory = "high";
        }
        
        switch (domain) {
            case 'sleep':
                if (scoreCategory === "low") {
                    // Low Score (0-7)
                    const lowSleepRecs = [
                        "Establish a consistent sleep schedule, going to bed and waking up at the same time daily, even on weekends.",
                        "Create a bedtime routine that includes 30 minutes of screen-free time and a calming activity like reading or gentle stretching.",
                        "Optimize your sleep environment by keeping your bedroom cool (65-67°F), dark, and quiet.",
                        "Improve sleep quality by limiting caffeine after noon and avoiding alcohol within 3 hours of bedtime.",
                        "Try a 5-minute meditation before bed to calm your mind and prepare for sleep."
                    ];
                    recommendation = lowSleepRecs[Math.floor(Math.random() * lowSleepRecs.length)];
                } else if (scoreCategory === "medium") {
                    // Medium Score (8-14)
                    const mediumSleepRecs = [
                        "Maintain good sleep hygiene and consider adding sleep-promoting foods to your evening routine like tart cherries, kiwi, or herbal tea.",
                        "Maintain your consistent sleep triggers while also troubleshooting any occasional sleep disturbances proactively.",
                        "Consider using a sleep journal to identify patterns and areas for improvement in your sleep quality."
                    ];
                    recommendation = mediumSleepRecs[Math.floor(Math.random() * mediumSleepRecs.length)];
                } else {
                    // High Score (15-20)
                    const highSleepRecs = [
                        "Fine-tune your already good sleep habits by ensuring your mattress and pillows properly support your sleeping position.",
                        "Experiment with advanced relaxation techniques like progressive muscle relaxation to further enhance your sleep quality."
                    ];
                    recommendation = highSleepRecs[Math.floor(Math.random() * highSleepRecs.length)];
                }
                break;
                
            case 'stress':
                if (scoreCategory === "low") {
                    // Low Score (0-7)
                    const lowStressRecs = [
                        "Begin a daily 5-minute mindfulness practice using a guided meditation app to build your stress resilience.",
                        "Identify your top three stress triggers and create a simple action plan for each.",
                        "Use the 'designated worry time' technique to contain intrusive thoughts rather than letting them take over your day.",
                        "Set clear boundaries between work and personal time by establishing specific transition rituals."
                    ];
                    recommendation = lowStressRecs[Math.floor(Math.random() * lowStressRecs.length)];
                } else if (scoreCategory === "medium") {
                    // Medium Score (8-14)
                    const mediumStressRecs = [
                        "Add box breathing to your routine (the 4-7-8 technique: inhale for 4, hold for 7, exhale for 8) practiced for 2 minutes twice daily.",
                        "Incorporate 20 minutes of nature exposure into your week, even if it's just sitting in a park or garden.",
                        "Practice gratitude journaling by writing down three things you're grateful for each day."
                    ];
                    recommendation = mediumStressRecs[Math.floor(Math.random() * mediumStressRecs.length)];
                } else {
                    // High Score (15-20)
                    const highStressRecs = [
                        "Enhance your stress management by exploring advanced practices like yoga, tai chi, or progressive muscle relaxation.",
                        "Consider keeping a gratitude journal to further amplify your positive mindset.",
                        "Explore stress management workshops with others, as social learning reinforces your own practices."
                    ];
                    recommendation = highStressRecs[Math.floor(Math.random() * highStressRecs.length)];
                }
                break;
                
            case 'physical':
                if (scoreCategory === "low") {
                    // Low Score (0-7)
                    const lowPhysicalRecs = [
                        "Start with a 10-minute daily walk, focusing on consistency rather than intensity.",
                        "Find an accountability partner to help maintain your routine by taking walks together, calling, or texting.",
                        "Add strength training to your routine twice weekly, even if it's just bodyweight exercises like squats, push-ups, and lunges.",
                        "Increase activity variety by trying a new form of exercise that appeals to you, such as dancing, swimming, or cycling."
                    ];
                    recommendation = lowPhysicalRecs[Math.floor(Math.random() * lowPhysicalRecs.length)];
                } else if (scoreCategory === "medium") {
                    // Medium Score (8-14)
                    const mediumPhysicalRecs = [
                        "Incorporate active breaks throughout your day (try 2-5 minutes of movement every hour).",
                        "Prioritize recovery with proper warm-ups, cool-downs, and active recovery days to prevent injury.",
                        "Consider periodization in your training to continue making progress while preventing plateaus."
                    ];
                    recommendation = mediumPhysicalRecs[Math.floor(Math.random() * mediumPhysicalRecs.length)];
                } else {
                    // High Score (15-20)
                    const highPhysicalRecs = [
                        "Fine-tune your nutrition timing around workouts to optimize your performance and recovery.",
                        "Experiment with new activities to keep your routine fresh and engaging."
                    ];
                    recommendation = highPhysicalRecs[Math.floor(Math.random() * highPhysicalRecs.length)];
                }
                break;
                
            case 'nutrition':
                if (scoreCategory === "low") {
                    // Low Score (0-7)
                    const lowNutritionRecs = [
                        "Focus on adding one serving of vegetables to each meal rather than eliminating foods.",
                        "Track your eating patterns with meals and snacks at consistent times to regulate your metabolism.",
                        "Start meal planning for one week to increase awareness of your eating patterns without judgment.",
                        "Stay hydrated by keeping a water bottle with you and drinking a glass of water before each meal."
                    ];
                    recommendation = lowNutritionRecs[Math.floor(Math.random() * lowNutritionRecs.length)];
                } else if (scoreCategory === "medium") {
                    // Medium Score (8-14)
                    const mediumNutritionRecs = [
                        "Aim to fill half your plate with colorful vegetables and fruits at each meal.",
                        "Experiment with plant-based protein sources like legumes, tofu, or tempeh to support gut health.",
                        "Practice mindful eating by slowing down and savoring each bite without distractions."
                    ];
                    recommendation = mediumNutritionRecs[Math.floor(Math.random() * mediumNutritionRecs.length)];
                } else {
                    // High Score (15-20)
                    const highNutritionRecs = [
                        "Fine-tune your nutrition by adding more plant-based protein sources like beans, lentils, and tofu.",
                        "Experiment with new herbs and spices to keep healthy eating exciting and flavorful.",
                        "Consider a 12-hour overnight fasting window to support cellular health and metabolism."
                    ];
                    recommendation = highNutritionRecs[Math.floor(Math.random() * highNutritionRecs.length)];
                }
                break;
                
            case 'social':
                if (scoreCategory === "low") {
                    // Low Score (0-7)
                    const lowSocialRecs = [
                        "Schedule regular check-ins with people you care about.",
                        "Join an online or in-person group based on a hobby or interest you enjoy.",
                        "Practice small social interactions daily, like chatting with a barista or neighbor."
                    ];
                    recommendation = lowSocialRecs[Math.floor(Math.random() * lowSocialRecs.length)];
                } else if (scoreCategory === "medium") {
                    // Medium Score (8-14)
                    const mediumSocialRecs = [
                        "Deepen existing relationships by having a meaningful conversation that goes beyond small talk.",
                        "Set up time with someone in your community as a go-to support through social bonds.",
                        "Create a regular social ritual, like a monthly dinner with a nearby game night."
                    ];
                    recommendation = mediumSocialRecs[Math.floor(Math.random() * mediumSocialRecs.length)];
                } else {
                    // High Score (15-20)
                    const highSocialRecs = [
                        "Mentor others or share your knowledge and experience through volunteering or community service.",
                        "Diversify your social circle by connecting with people from different backgrounds or generations.",
                        "Consider hosting gatherings that bring together people from different parts of your life."
                    ];
                    recommendation = highSocialRecs[Math.floor(Math.random() * highSocialRecs.length)];
                }
                break;
        }
        
        recommendations.push(recommendation);
    });
    
    return recommendations;
}

// Create results chart
function createResultsChart(scores) {
    const ctx = document.getElementById('results-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Sleep', 'Stress Management', 'Physical Activity', 'Nutrition', 'Social Connections'],
            datasets: [{
                label: 'Your Scores',
                data: [scores.sleep, scores.stress, scores.physical, scores.nutrition, scores.social],
                backgroundColor: 'rgba(74, 111, 165, 0.2)',
                borderColor: 'rgba(74, 111, 165, 1)',
                pointBackgroundColor: 'rgba(74, 111, 165, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(74, 111, 165, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 10
                }
            }
        }
    });
}

// Initialize the assessment when the page loads
window.addEventListener('DOMContentLoaded', initializeAssessment);
