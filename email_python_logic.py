# %%

import subprocess
from pydantic_settings import BaseSettings, SettingsConfigDict
from msal import ConfidentialClientApplication
import os


os.environ["PYTHONPATH"] = os.path.abspath(os.path.join(os.getcwd(), ".."))


class ErEmailSettings(BaseSettings):
    client_id: str
    client_secret_value: str

    @property
    def access_token(self) -> str:
        app = ConfidentialClientApplication(
            client_id=self.client_id,
            client_credential=self.client_secret_value,
            authority=er_base_settings.authority,
        )
        scope = "https://graph.microsoft.com/.default"
        result = app.acquire_token_for_client(scopes=[scope])

        if "access_token" in result:
            return result["access_token"]
        else:
            error_message = result.get("error_description", "Unknown error")
            error_code = result.get("error", "No error code available")
            print(f"Error {error_code}: {error_message}")
            raise Exception(f"Failed to obtain access token: {error_message}")

    @property
    def headers(self) -> dict:
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json",
        }

    model_config = SettingsConfigDict(
        env_prefix="ER_EMAIL_", env_file_encoding="utf-8", extra="ignore"
    )


er_email_settings = ErEmailSettings()
er_email_settings


import requests
from config import er_email_settings


# %%
def send_email(
    post_code: str,
    issue_type: str,
    acknowledgement: str,
    customer_email: str = "john.doe@gmail.com",
) -> str:
    """
    Sent only once by the end of the flow.
    Sends an acknowledgement email to the customer regarding the reported issue.

    This function creates and sends an email notification to the specified customer to confirm receipt
    of their reported issue. It utilizes the Microsoft Graph API to send the email.

    Args:
        customer_email (str): The email address of the customer receiving the acknowledgment.
        post_code (str): The post code associated with the customer’s report.
        issue_type (str): A description of the type of issue being reported.
        acknowledgement (str): The content of the acknowledgment message to be sent to the customer.
        state: The injected state for context.

    Returns:
        str: A message indicating the result of the email sending process.
    """

    user_email = "admin@ever-ready.ai"
    endpoint = f"https://graph.microsoft.com/v1.0/users/{user_email}/sendMail"

    email_message = {
        "message": {
            "subject": f"{issue_type} reported at {post_code}",
            "body": {"contentType": "Text", "content": acknowledgement},
            "toRecipients": [{"emailAddress": {"address": customer_email}}],
        }
    }

    response = requests.post(
        endpoint, headers=er_email_settings.headers, json=email_message
    )

    if response.status_code == 202:
        print("Email sent successfully.")
        return "Email sent successfully."
    else:
        print(f"Error: {response.status_code}")
        print(response.json())
        return f"Error: {response.status_code}"
