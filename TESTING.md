# Longevity Snapshot Assessment - Testing Guide

This document provides guidance for testing the Longevity Snapshot Assessment application before deployment to Windsurf AI.

## Test Scenarios

### 1. Complete Conversation Flow

Test the entire assessment flow from start to finish:
- Verify welcome message appears correctly
- Answer all questions in each domain
- Confirm progress bars update appropriately
- Verify results display with chart, domain scores, and recommendations
- Test follow-up questions about recommendations
- Check exit and reassessment paths

### 2. Scoring Logic Verification

Test with various response types to ensure scoring works correctly:
- **Sleep domain**: Test responses indicating good/poor sleep habits
- **Stress domain**: Test responses indicating high/low stress levels
- **Physical Activity domain**: Test responses with varying activity levels
- **Nutrition domain**: Test responses with different dietary patterns
- **Social Connections domain**: Test responses with varying social engagement

### 3. Recommendation Appropriateness

Verify recommendations are appropriate for the provided responses:
- Complete assessment with intentionally low scores in specific domains
- Verify recommendations target the lowest-scoring domains
- Check that recommendation content is relevant to the responses provided
- Verify that recommendations are actionable and clear

### 4. Edge Cases and Unclear Responses

Test the system's handling of edge cases:
- Very short responses (1-2 characters)
- Responses with only special characters
- Extremely long responses
- Responses that don't directly answer the question
- Empty responses (should not proceed)

### 5. Follow-Up Support Testing

Test the follow-up conversation capabilities:
- Ask for more information about specific recommendations
- Request implementation tips
- Schedule a reassessment
- Test domain-specific follow-up questions
- Verify appropriate fallback responses for unclear questions

## Deployment Checklist

Before deploying to Windsurf AI:

1. ✅ All conversation paths function correctly
2. ✅ Scoring logic works appropriately for all response types
3. ✅ Recommendations are personalized and relevant
4. ✅ Fallback responses handle unclear inputs gracefully
5. ✅ Follow-up support provides detailed, helpful information
6. ✅ UI displays correctly on different screen sizes
7. ✅ All progress indicators function properly
8. ✅ Results visualization is clear and informative

## Windsurf AI Configuration

When configuring in Windsurf AI:

1. Use the system prompt provided in the project documentation
2. Set up conversation paths for each domain
3. Configure fallback responses for unclear inputs
4. Set appropriate permissions for user access
5. Generate and test the access link or embed code

## Notes for Edge Case Handling

The application includes several fallback mechanisms:
- Main assessment fallbacks for unclear responses
- Follow-up conversation fallbacks for ambiguous questions
- Exit path for users who want to conclude the assessment
- Reassessment scheduling for continued engagement
