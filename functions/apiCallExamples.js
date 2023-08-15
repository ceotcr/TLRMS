const apiCallDataExamples = {
  "post:signup": {
    "name": "Eleanor Johnson",
    "username": "ceo",
    "email": "ceo@gmail.com",
    "password": "2kP#8xLz",
    "phone": "4548463212",
    "role": "Admin"
  },
  "post:login": {
    "username": "ceo",
    "password": "2kP#8xLz"
  },
  "getProfile": {
    "Authorisation": {
      "Bearer Token": "token from login response"
    }
  },
  "get:courses": {
    "Authorisation": {
      "Bearer Token": "token from login response"
    }
  },
  "post:addcourse": {
    "Authorisation": {
      "Bearer Token": "token from login response"
    },
    "courseName": "Mathematics",
    "courseCode": "MTH101",
    "courseDescription": "This is a course on Mathematics"
  },
  "post:updatecourse": {
    "Authorisation": {
      "Bearer Token": "token from login response"
    },
    "id": "1",
    "courseName": "Mathematics",
    "courseCode": "MTH101",
    "courseDescription": "This is a course on Mathematics"
  },
  "post:deletecourse": {
    "Authorisation": {
      "Bearer Token": "token from login response"
    },
    "id": "1"
  },
  "get:events": {
    "Authorisation": {
      "Bearer Token": "token from login response"
    },
    "start": "2020-05-01",
    "end": "2020-05-31"
  },
  "post:addevent": {
    "Authorisation": {
      "Bearer Token": "token from login response"
    },
    "title": "Mathematics",
    "description": "This is a event on Mathematics",
    "start": "2020-05-01",
    "end": "2020-05-31"
  },
  // pending update and delete event
  "post:updateevent": {
    "Authorisation": {
      "Bearer Token": "token from login response"
    },
    "id": "1",
    "title": "Mathematics",
    "description": "This is a event on Mathematics",
    "start": "2020-05-01",
    "end": "2020-05-31"
  },
  "post:deleteevent": {
    "Authorisation": {
      "Bearer Token": "token from login response"
    },
    "id": "1"
  },
  "get:timetable": {
    "Authorisation": {
      "Bearer Token": "token from login response"
    },
    "forclass": "JSS1"
  },
  "post:addtimetable": {
    "Authorisation": {
      "Bearer Token": "token from login response"
    },
    "day": "Monday",
    "period": "1",
    "subject": "Mathematics",
    "teacher": "Mr. John",
    "forclass": "JSS1"
  },
  // pending update and delete timetable
  "post:updatetimetable": {
    "Authorisation": {
      "Bearer Token": "token from login response"
    },
    "id": "1",
    "day": "Monday",
    "period": "1",
    "subject": "Mathematics",
    "teacher": "Mr. John",
    "forclass": "JSS1"
  },
  "post:deletetimetable": {
    "Authorisation": {
      "Bearer Token": "token from login response"
    },
    "id": "1"
  }
}

const schema = {
  "verifyusers": ["id", "name", "username", "email", "password", "phone", "role", " token"],
  "users": ["id", "name", "username", "email", "password", "phone", "role"],
  "course": ["id", "courseName", "courseCode", "courseDescription"],
  "events": ["id", "title", "description", "start", "end"],
  "timetable": ["id", "day", "period", "subject", "teacher", "forclass"]
}