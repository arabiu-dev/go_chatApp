package redis

import (
	"context"
	"log"
	"os"

	"github.com/go-redis/redis/v8"
)

var redisClient *redis.Client

func Init() *redis.Client {
	conn := redis.NewClient(&redis.Options{
		Addr:     os.Getenv("RD_Conn"),
		Password: os.Getenv("RD_Pass"),
		DB:       0,
	})

	pong, err := conn.Ping(context.Background()).Result()
	if err != nil {
		log.Fatal("Redis Connection Failed",
			err)
	}

	log.Println("Redis Successfully Connected.",
		"Ping", pong)

	redisClient = conn

	return redisClient

}
