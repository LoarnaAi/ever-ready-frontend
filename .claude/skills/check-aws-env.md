# Check AWS Environment Variables

Check if the required AWS environment variables are configured and display them in a redacted format for security.

## Required Environment Variables

The following AWS environment variables should be checked:
- AWS_SETTINGS_KEY_ID
- AWS_SETTINGS_SECRET_NAME
- AWS_SETTINGS_REGION
- AWS_SETTINGS_ACCESS_KEY

## Instructions

1. Check each of the AWS environment variables listed above
2. For each variable:
   - If it exists, display it in a REDACTED format (show only first 4 and last 4 characters)
   - If it doesn't exist, indicate that it's NOT SET
3. Present the results in a clear, formatted table
4. Use bash commands to check the environment variables
5. NEVER display the full values of sensitive credentials

## Redaction Rules

- For variables with values longer than 8 characters: show first 4 chars + "..." + last 4 chars
- For variables with values 8 characters or less: show first 2 chars + "..." + last 2 chars
- For empty or unset variables: display "NOT SET"

## Output Format

Present the results as a markdown table with columns:
- Variable Name
- Status (SET/NOT SET)
- Redacted Value
