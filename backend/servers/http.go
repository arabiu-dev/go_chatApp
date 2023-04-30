package servers

import (
	"os"

	"github.com/arabiu-dev/go_chatApp/middleware"
	"github.com/arabiu-dev/go_chatApp/redis"
	"github.com/arabiu-dev/go_chatApp/routes"
	"github.com/gin-gonic/gin"
)

func HttpServer() {
	redisClient := redis.Init()
	defer redisClient.Close()

	redis.CreateFetchChatBetweenIndex()

	gin.SetMode(gin.ReleaseMode)

	router := gin.Default()
	router.Use(gin.Logger())
	router.Use(middleware.Cors())

	routes.Public(router)

	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Welcome to the chat server"})
	})

	router.Run(":" + os.Getenv("PORT"))
}
