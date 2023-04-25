## Apis with fields

- Signup - name, username, email, password, phone, role
  
  Api - http://localhost:8000/api/v1/auth/signup (POST)

- Verify mail - name, username, email, phone, password, role, token

    Api - http://localhost:8000/api/v1/auth/verify-email?token="verificationToken" (GET)

- Login - username, password

  Api - http://localhost:8000/api/v1/auth/login (POST)
