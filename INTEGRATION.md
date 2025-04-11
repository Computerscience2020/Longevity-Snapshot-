# Longevity Snapshot Assessment - Integration Guide

This document provides guidance for integrating the Longevity Snapshot Assessment with Windsurf AI and your frontend systems.

## Windsurf AI API Integration

### 1. Initialize Conversations

```javascript
// Example code for initializing a conversation with Windsurf AI
async function initializeConversation() {
  const response = await fetch('https://api.windsurf.ai/v1/conversations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      agent_id: 'your_longevity_snapshot_agent_id'
    })
  });
  
  const data = await response.json();
  return data.conversation_id;
}
```

### 2. Send User Responses

```javascript
// Example code for sending user responses to Windsurf AI
async function sendUserResponse(conversationId, userMessage) {
  const response = await fetch(`https://api.windsurf.ai/v1/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      content: userMessage,
      role: 'user'
    })
  });
  
  return await response.json();
}
```

### 3. Retrieve AI Responses

```javascript
// Example code for retrieving AI responses from Windsurf AI
async function getAIResponse(conversationId) {
  const response = await fetch(`https://api.windsurf.ai/v1/conversations/${conversationId}/messages?role=assistant&limit=1`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  });
  
  const data = await response.json();
  return data.messages[0].content;
}
```

### 4. Access Scoring Data

```javascript
// Example code for accessing scoring data from Windsurf AI
async function getScoringData(conversationId) {
  const response = await fetch(`https://api.windsurf.ai/v1/conversations/${conversationId}/metadata`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  });
  
  const data = await response.json();
  return data.scoring;
}
```

## Frontend Data Storage

### 1. Store Scores in Frontend

```javascript
// Example code for storing scores in frontend
function storeScores(overallScore, domainScores) {
  // Store in localStorage for persistence
  localStorage.setItem('longevityOverallScore', JSON.stringify(overallScore));
  localStorage.setItem('longevityDomainScores', JSON.stringify(domainScores));
  
  // Alternatively, send to your backend
  sendScoresToBackend(overallScore, domainScores);
}

async function sendScoresToBackend(overallScore, domainScores) {
  await fetch('https://your-backend.com/api/longevity-scores', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: getCurrentUserId(),
      overallScore,
      domainScores,
      timestamp: new Date().toISOString()
    })
  });
}
```

### 2. Display Visualizations

The current implementation already includes visualization using Chart.js. To integrate with your frontend:

1. Ensure Chart.js is included in your project
2. Use the existing chart creation code or adapt it to your needs
3. Update the DOM elements to match your frontend structure

### 3. Save User Results

```javascript
// Example code for saving complete user results
async function saveUserResults(userId, assessmentResults) {
  await fetch('https://your-backend.com/api/assessment-results', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId,
      results: assessmentResults,
      completedAt: new Date().toISOString()
    })
  });
}
```

### 4. Enable Progress Tracking

```javascript
// Example code for tracking progress across multiple assessments
async function getUserProgressHistory(userId) {
  const response = await fetch(`https://your-backend.com/api/user-progress/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
}

function displayProgressChart(progressHistory) {
  // Implementation using Chart.js or your preferred visualization library
  // to show changes in scores over time
}
```

## Webhook Triggers

### 1. Configure Webhook for Completed Assessments

```javascript
// In your Windsurf AI dashboard, configure a webhook endpoint
// Example webhook handler in your backend
app.post('/api/webhooks/assessment-completed', (req, res) => {
  const { conversationId, userId, assessmentData } = req.body;
  
  // Store results
  storeAssessmentResults(userId, assessmentData);
  
  // Schedule follow-up communications
  scheduleFollowUpCommunications(userId);
  
  // Set reminder for reassessment
  scheduleReassessmentReminder(userId);
  
  res.status(200).send('Webhook received');
});
```

### 2. Enable Follow-Up Communications

```javascript
// Example code for scheduling follow-up communications
function scheduleFollowUpCommunications(userId) {
  // Schedule an email for 3 days after assessment
  scheduleEmail(userId, 'follow_up_3_days', new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
  
  // Schedule an email for 1 week after assessment with implementation tips
  scheduleEmail(userId, 'implementation_tips', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
}

async function scheduleEmail(userId, templateId, scheduledDate) {
  await fetch('https://your-backend.com/api/scheduled-emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId,
      templateId,
      scheduledDate: scheduledDate.toISOString()
    })
  });
}
```

### 3. Support Reassessment Reminders

```javascript
// Example code for scheduling reassessment reminders
function scheduleReassessmentReminder(userId) {
  // Schedule reminder for 4 weeks after assessment
  const reassessmentDate = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000);
  
  scheduleEmail(userId, 'reassessment_reminder', reassessmentDate);
  
  // Also store the scheduled reassessment date
  storeReassessmentDate(userId, reassessmentDate);
}

async function storeReassessmentDate(userId, reassessmentDate) {
  await fetch('https://your-backend.com/api/reassessment-dates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId,
      reassessmentDate: reassessmentDate.toISOString()
    })
  });
}
```

## Implementation Checklist

- [ ] Set up Windsurf AI agent with provided system prompt
- [ ] Configure API authentication and endpoints
- [ ] Implement frontend integration for conversation flow
- [ ] Set up data storage for assessment results
- [ ] Configure webhooks for assessment completion
- [ ] Implement follow-up communication system
- [ ] Set up reassessment reminder functionality
- [ ] Test complete integration flow

## Security Considerations

1. **API Key Protection**: Never expose your Windsurf AI API key in client-side code
2. **User Data Privacy**: Ensure all health data is stored securely and in compliance with relevant regulations
3. **Consent**: Obtain user consent for storing health data and sending follow-up communications
4. **Data Retention**: Implement appropriate data retention policies

## Additional Resources

- [Windsurf AI API Documentation](https://docs.windsurf.ai)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [Webhook Best Practices](https://webhook.site/docs/best-practices)
