package main

import (
	"fmt"
	"log"

	"github.com/arabiu-dev/go_chatApp/servers"
	"github.com/joho/godotenv"
)

func init() {
	// Load the environment file .env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Unable to Load the env file.", err)
	}
}

func main() {

	fmt.Println("websocket server is starting on :8081")
	go servers.StartWebsocketServer()
	fmt.Println("http server is starting on :8080")
	servers.HttpServer()
}
