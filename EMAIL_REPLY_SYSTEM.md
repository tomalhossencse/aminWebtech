# Email Reply System Documentation

## Overview
The contact management system now includes a comprehensive email reply tracking system that allows admins to reply to contacts via their default email client while automatically tracking the replies in the database.

## How It Works

### 1. Reply via Email Client
When an admin clicks "Reply via Email":

1. **Tracking ID Generation**: A unique tracking ID is generated: `TRACK_{contactId}_{timestamp}`
2. **Email Template**: A pre-filled email is created with:
   - Recipient: Contact's email
   - Subject: `Re: {original subject} [TRACK_{contactId}_{timestamp}]`
   - Body: Professional reply template with original message
3. **Email Client Opens**: The system opens the user's default email client (Gmail, Outlook, etc.)
4. **Database Tracking**: The system immediately tracks that an email client was opened
5. **Status Update**: Contact status is updated to "replied"

### 2. Database Structure

#### Contacts Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  subject: String,
  message: String,
  status: "new" | "read" | "replied" | "spam",
  repliedAt: Date,
  lastReply: {
    message: String,
    sentAt: Date,
    adminEmail: String,
    trackingId: String,
    method: "email_client" | "quick_reply"
  }
}
```

#### Replies Collection
```javascript
{
  contactId: String,
  adminEmail: String,
  replyMessage: String,
  sentAt: Date,
  recipientEmail: String,
  recipientName: String,
  originalSubject: String,
  trackingId: String,
  method: "email_client" | "quick_reply" | "email_received",
  status: "sent" | "received"
}
```

### 3. API Endpoints

#### POST /api/contacts/:id/reply
- **Purpose**: Track email replies (both quick replies and email client usage)
- **Parameters**: 
  - `message`: Reply content
  - `trackingId`: Optional tracking ID for email client replies
- **Response**: Success confirmation with tracking ID

#### POST /api/contacts/email-webhook
- **Purpose**: Receive webhooks from email services when replies are received
- **Parameters**: Standard email webhook data (from, to, subject, body, etc.)
- **Functionality**: Extracts tracking ID from subject and updates database

#### GET /api/contacts/:id/replies
- **Purpose**: Get all replies for a specific contact
- **Response**: Array of reply records

### 4. Email Service Integration (Future)

The system is designed to integrate with email services like:

#### SendGrid
```javascript
// Webhook URL: https://yourdomain.com/api/contacts/email-webhook
// Configure in SendGrid dashboard
```

#### Mailgun
```javascript
// Webhook URL: https://yourdomain.com/api/contacts/email-webhook
// Configure in Mailgun dashboard
```

#### AWS SES
```javascript
// Use SNS to forward emails to webhook
// Configure SES -> SNS -> HTTP endpoint
```

### 5. Features

✅ **Email Client Integration**: Opens default email client with pre-filled content  
✅ **Tracking ID System**: Unique tracking for each reply  
✅ **Database Logging**: All replies are tracked in the database  
✅ **Status Management**: Automatic status updates  
✅ **Professional Templates**: Pre-formatted email templates  
✅ **Webhook Ready**: Ready for email service integration  
✅ **Quick Reply Option**: Alternative in-app reply system  

### 6. Usage Instructions

1. **View Contact**: Click "View" on any contact in the dashboard
2. **Reply via Email**: Click "Reply via Email" button
3. **Email Client Opens**: Your default email client opens with pre-filled content
4. **Send Reply**: Send the email from your email client
5. **Automatic Tracking**: The system automatically tracks the reply
6. **Status Update**: Contact status is updated to "replied"

### 7. Benefits

- **Familiar Interface**: Use your preferred email client
- **Professional Appearance**: Emails come from your actual email address
- **Automatic Tracking**: No manual status updates needed
- **Complete History**: All replies are logged in the database
- **Scalable**: Ready for email service integration

### 8. Future Enhancements

- **Real Email Integration**: Connect with SendGrid/Mailgun for actual email sending
- **Email Templates**: Customizable email templates
- **Signature Management**: Automatic email signatures
- **Reply Threading**: Track email conversation threads
- **Email Analytics**: Open rates, click tracking, etc.

## Technical Implementation

The system uses:
- **mailto: links** for email client integration
- **Tracking IDs** embedded in email subjects
- **MongoDB collections** for data persistence
- **Webhook endpoints** for email service integration
- **React Query** for state management
- **Professional UI** with loading states and error handling