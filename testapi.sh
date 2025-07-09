curl -X POST \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uZGtvd213enhmYm9uYmxkenNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MTM1NTMsImV4cCI6MjA2MzA4OTU1M30.qu1ArbyDFJJZehbTU1cY4GldtaazTuiXcvAKAD82xnw" \
  -H "Authorization: Bearer SEU_JWT_DO_USUARIO" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.edu.com",
    "name": "Teste",
    "employee_number": "",
    "job": "",
    "functional_category": "",
    "education": ""
  }' \
  "https://nndkowmwzxfbonbldzsc.supabase.co/rest/v1/user_profile"
