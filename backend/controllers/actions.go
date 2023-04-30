package controllers

import (
	"net/http"

	"github.com/arabiu-dev/go_chatApp/models"
	"github.com/gin-gonic/gin"
)

func Signup() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.Header("Content-Type", "application/json")
		body := &models.UserReq{}

		if err := ctx.BindJSON(&body); err != nil {
			ctx.AbortWithError(http.StatusBadRequest, err)
			return
		}

		res := register(body)
		ctx.JSON(http.StatusCreated, &res)
	}
}

func Signin() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.Header("Content-Type", "application/json")
		body := &models.UserReq{}

		if err := ctx.BindJSON(&body); err != nil {
			ctx.AbortWithError(http.StatusBadRequest, err)
			return
		}

		res := login(body)
		ctx.JSON(http.StatusCreated, &res)
	}
}

func Verify() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.Header("Content-Type", "application/json")
		body := &models.UserReq{}

		if err := ctx.BindJSON(&body); err != nil {
			ctx.AbortWithError(http.StatusBadRequest, err)
			return
		}

		res := verifyContact(body.Username)
		ctx.JSON(http.StatusCreated, &res)
	}
}

func Chats() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.Header("Content-Type", "application/json")

		user1 := ctx.Request.URL.Query().Get("user1")
		user2 := ctx.Request.URL.Query().Get("user2")
		fromTS, toTS := "0", "+inf"

		if ctx.Request.URL.Query().Get("from-ts") != "" && ctx.Request.URL.Query().Get("to-ts") != "" {
			fromTS = ctx.Request.URL.Query().Get("from-ts")
			toTS = ctx.Request.URL.Query().Get("to-ts")
		}

		res := chatHistory(user1, user2, fromTS, toTS)
		ctx.JSON(http.StatusCreated, &res)
	}
}

func Contacts() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.Header("Content-Type", "application/json")

		u := ctx.Request.URL.Query().Get("username")

		res := contactList(u)
		ctx.JSON(http.StatusCreated, &res)
	}
}
