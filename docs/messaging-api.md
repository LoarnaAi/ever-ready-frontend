# Messaging API Examples

Use these curl commands to exercise the local messaging endpoints while the dev server is running on `http://localhost:3000`.

```bash
# Test email API (plain text)
curl -X POST http://localhost:3000/api/messaging/email \
  -H "Content-Type: application/json" \
  -d '{"busRef":"DEMO","to":"lohith.uvce@gmail.com","subject":"Test","bodyContent":"Hello"}'

# Test email API (HTML)
curl -X POST http://localhost:3000/api/messaging/email \
  -H "Content-Type: application/json" \
  -d '{"busRef":"DEMO","to":"lohith.uvce@gmail.com","subject":"HTML Test","bodyType":"Html","bodyContent":"<h1>Hello</h1><p>This is <strong>HTML</strong>.</p>"}'

# Test WhatsApp API
curl -X POST http://localhost:3000/api/messaging/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"busRef":"DEMO","to":"+447123456789","message":"Test message"}'
```
