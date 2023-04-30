package middleware

import (
	"github.com/gin-gonic/gin"
)

func Cors() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		ctx.Writer.Header().Set("Access-Control-Expose-Headers", "*")
		ctx.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		ctx.Writer.Header().Set("Content-Type", "application/json")
		ctx.Writer.Header().Set("Access-Control-Allow-Headers",
			"Content-Type, Content-Length,Accept-Encoding,X-CSRF-Token, Authorization, token, accept, origin, X-Requested-With")
		ctx.Writer.Header().Set("Access-Control-Allow-Methods", "POST, DELETE, OPTIONS, GET, PUT")

		if ctx.Request.Method == "OPTIONS" {
			ctx.AbortWithStatus(204)
			return
		}

		ctx.Next()
	}
}
