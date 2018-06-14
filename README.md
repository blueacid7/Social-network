# Social-network

Signup (unique username and emailid)

	https://socailcast.herokuapp.com/signup
	body : {
          "username":"vprasad03",
          "email": "vprasad02@gmail.com"
          "password":"abcde"
           }
Login (Can loginonly after signup)

	https://socailcast.herokuapp.com/login
	body : {
          "username":"vprasad03",
          "password":"abcde"
           }


Create a post (only after login)

	https://socailcast.herokuapp.com/createPost
	body : {
          "content" : "I love IOT,ICO and machine learning (3 Buzz words)"
	       }

Follow a user (only after signup)

	https://socailcast.herokuapp.com/follow
	body : {
          "userID" : "vprasad02"
           }

Feeds (list of post by whom you are following only after login)

	https://socailcast.herokuapp.com/getFeeds


