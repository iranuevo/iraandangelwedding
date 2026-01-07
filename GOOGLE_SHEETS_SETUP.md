# Google Sheets RSVP Setup Guide

This guide will walk you through setting up Google Sheets integration for your wedding website RSVP form.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click "Create" or "+" to create a new spreadsheet
3. Name your spreadsheet "Wedding RSVP Responses" (or any name you prefer)
4. In the first row, create the following headers:
   - A1: `Timestamp`
   - B1: `Name`
   - C1: `Number of Guests`
   - D1: `Attending`
   - E1: `Message`

## Step 2: Create Google Apps Script

1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete any existing code in the script editor
3. Copy and paste the following code:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSheet();
    
    // Parse the JSON data from the request
    var data = JSON.parse(e.postData.contents);
    
    // Prepare the row data (without email field)
    var rowData = [
      data.timestamp,
      data.name,
      data.guests,
      data.attending === 'yes' ? 'Yes' : 'No',
      data.message || ''
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'RSVP submitted successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Error processing RSVP: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Optional: Handle GET requests for testing
  return ContentService
    .createTextOutput('RSVP endpoint is working!')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

4. Save the script by clicking the **Save** button (💾) or pressing `Ctrl+S`
5. Give your project a name like "Wedding RSVP Handler"

## Step 3: Deploy as Web App

1. In the Apps Script editor, click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Type" and select **Web app**
3. Fill in the deployment settings:
   - **Description**: "Wedding RSVP Form Handler"
   - **Execute as**: "Me (your-email@gmail.com)"
   - **Who has access**: "Anyone"
4. Click **Deploy**
5. **Important**: You'll be asked to authorize the script. Click **Authorize access**
6. If you see a warning "Google hasn't verified this app", click **Advanced** → **Go to [Project Name] (unsafe)**
7. Click **Allow** to grant the necessary permissions
8. Copy the **Web app URL** that appears - it will look like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

## Step 4: Update Your Website Code

### For index.html:
Find this line in your `index.html` file:
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

Replace `YOUR_SCRIPT_ID` with your actual Web App URL from Step 3.

### For wedding_website.tsx:
Find this line in your `wedding_website.tsx` file:
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

Replace `YOUR_SCRIPT_ID` with your actual Web App URL from Step 3.

## Step 5: Test Your Setup

1. Open your wedding website
2. Fill out the RSVP form with test data
3. Submit the form
4. Check your Google Sheet - you should see the new response appear
5. If you see a success message on the website and data in the sheet, everything is working!

## Troubleshooting

### Common Issues:

1. **"Script function not found" error**
   - Make sure you saved the Apps Script code
   - Ensure the function is named `doPost` exactly

2. **Permission denied errors**
   - Re-run the authorization process in Apps Script
   - Make sure "Who has access" is set to "Anyone"

3. **CORS errors in browser console**
   - This is normal when using `mode: 'no-cors'`
   - The form should still work despite these console messages

4. **Data not appearing in sheet**
   - Check that your sheet headers match exactly: Timestamp, Name, Number of Guests, Attending, Message
   - Verify the Web App URL is correct in your website code

### Testing the Endpoint Directly:

You can test your Google Apps Script endpoint by visiting the Web App URL in your browser. You should see "RSVP endpoint is working!" if everything is set up correctly.

## Security Notes

- The Web App is set to "Anyone" access, which means anyone with the URL can submit data
- Consider adding basic validation or rate limiting if you're concerned about spam
- The script only accepts POST requests for RSVP submissions
- All data is stored in your private Google Sheet

## Data Management

Your RSVP responses will automatically appear in your Google Sheet with:
- Timestamp of submission
- Guest name(s)
- Number of guests
- Attendance status (Yes/No)
- Optional message

You can sort, filter, and analyze this data directly in Google Sheets, or export it to other formats as needed.