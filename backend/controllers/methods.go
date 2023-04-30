package controllers

import (
	"fmt"
	"log"

	"github.com/arabiu-dev/go_chatApp/models"
	"github.com/arabiu-dev/go_chatApp/redis"
)

func register(u *models.UserReq) *models.Response {
	// check if username in userset
	// return error if exist
	// create new user
	// create response for error
	res := &models.Response{Status: true}

	status := redis.IsUserExist(u.Username)
	if status {
		res.Status = false
		res.Message = "username already taken. try something else."
		return res
	}

	err := redis.RegisterNewUser(u.Username, u.Password, u.Photo)
	if err != nil {
		res.Status = false
		res.Message = "something went wrong while registering the user. please try again after sometime."
		return res
	}

	res.Photo = u.Photo
	return res
}

func login(u *models.UserReq) *models.Response {
	// if invalid username and password return error
	// if valid user create new session
	res := &models.Response{Status: true}

	photo, err := redis.IsUserAuthentic(u.Username, u.Password)
	if err != nil {
		res.Status = false
		res.Message = err.Error()
		return res
	}
	res.Photo = photo

	return res
}

func verifyContact(username string) *models.Response {
	// if invalid username and password return error
	// if valid user create new session
	res := &models.Response{Status: true}

	status := redis.IsUserExist(username)
	if !status {
		res.Status = false
		res.Message = "invalid username"
		return res
	}

	res.Photo = redis.GetPhoto(username)

	return res
}

func chatHistory(username1, username2, fromTS, toTS string) *models.Response {
	// if invalid usernames return error
	// if valid users fetch chats
	res := &models.Response{}

	fmt.Println(username1, username2)
	// check if user exists
	if !redis.IsUserExist(username1) || !redis.IsUserExist(username2) {
		res.Message = "incorrect username"
		return res
	}

	chats, err := redis.FetchChatBetween(username1, username2, fromTS, toTS)
	if err != nil {
		log.Println("error in fetch chat between", err)
		res.Message = "unable to fetch chat history. please try again later."
		return res
	}

	res.Status = true
	res.Data = chats
	res.Total = len(chats)
	return res
}

func contactList(username string) *models.Response {
	// if invalid username return error
	// if valid users fetch chats
	res := &models.Response{}

	// check if user exists
	if !redis.IsUserExist(username) {
		res.Message = "incorrect username"
		return res
	}

	contactList, err := redis.FetchContactList(username)
	if err != nil {
		log.Println("error in fetch contact list of username: ", username, err)
		res.Message = "unable to fetch contact list. please try again later."
		return res
	}

	res.Status = true
	res.Data = contactList
	res.Total = len(contactList)
	return res
}
