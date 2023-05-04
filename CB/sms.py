# Download the helper library from https://www.twilio.com/docs/python/install
import os
from twilio.rest import Client
# Set environment variables for your credentials
# Read more at http://twil.io/secure
account_sid = "ACb392c9df89e1d1ae223dfd7acc428084"
auth_token = "66974a5bb8fd2dd34ad7cc39f2277d1d"
client = Client(account_sid, auth_token)
message = client.messages.create(
  body="Hello from Twilio",
  from_="+16073177304",
  to="+919489919924"
)
print(message.sid)