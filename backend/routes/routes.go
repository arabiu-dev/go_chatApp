package routes

import (
	"github.com/arabiu-dev/go_chatApp/controllers"
	"github.com/gin-gonic/gin"
)

func Public(incomingRoute *gin.Engine) {
	v1 := incomingRoute.Group("app/")
	{
		v1.GET("/chats", controllers.Chats())
		v1.POST("/signup", controllers.Signup())
		v1.POST("/signin", controllers.Signin())
		v1.POST("/verify", controllers.Verify())
		v1.GET("/contacts", controllers.Contacts())
	}
}
