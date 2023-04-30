package redis

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/arabiu-dev/go_chatApp/helpers"
	"github.com/arabiu-dev/go_chatApp/models"
	"github.com/go-redis/redis/v8"
)

func RegisterNewUser(username, password, photo string) error {
	// redis-cli
	// SYNTAX: SET key value
	// SET username password
	// register new username:password key-value pair

	// err := redisClient.Set(context.Background(), username, password, 0).Err()
	res, err := redisClient.Do(
		context.Background(), "HSET", username, "password", password,
	).Result()

	if err != nil {
		log.Println("error while adding new user", err)
		return err
	}

	_, err = redisClient.Do(
		context.Background(), "HSET", username, "photo", photo,
	).Result()

	if err != nil {
		log.Println("error while adding new user", err)
		return err
	}
	log.Println("chat successfully set", res)

	// redis-cli
	// SYNTAX: SADD key value
	// SADD users username
	err = redisClient.SAdd(context.Background(), userSetKey(), username).Err()
	if err != nil {
		log.Println("error while adding user in set", err)
		// redis-cli
		// SYNTAX: DEL key
		// DEL username
		// drop the registered user
		redisClient.Del(context.Background(), username)

		return err
	}

	return nil
}

func IsUserExist(username string) bool {
	// redis-cli
	// SYNTAX: SISMEMBER key value
	// SISMEMBER users username
	return redisClient.SIsMember(context.Background(), userSetKey(), username).Val()
}

func GetPhoto(username string) string {
	// redis-cli
	// SYNTAX: SISMEMBER key value
	// SISMEMBER users username
	p, _ := redisClient.Do(
		context.Background(), "HGET", username, "photo",
	).Result()

	log.Println(p.(string))

	return p.(string)
}

func IsUserAuthentic(username, password string) (string, error) {
	// redis-cli
	// SYNTAX: GET key
	// GET username
	// p := redisClient.Get(context.Background(), username).Val()
	p, err := redisClient.Do(
		context.Background(), "HGET", username, "password",
	).Result()

	if err != nil {
		log.Println("error while checking password", err)
		return "", fmt.Errorf("invalid username or password")
	}

	if !strings.EqualFold(p.(string), password) {
		return "", fmt.Errorf("invalid username or password")
	}

	p, _ = redisClient.Do(
		context.Background(),
		"HGET",
		username,
		"photo",
	).Result()

	return fmt.Sprint((p)), nil
}

// UpdateContactList add contact to username's contact list
// if not present or update its timestamp as last contacted
func UpdateContactList(username, contact string) error {

	m := make(map[string]string)
	m["contact"] = contact
	m["photo"] = GetPhoto(contact)

	val, _ := json.Marshal((m))
	zs := &redis.Z{Score: float64(time.Now().Unix()), Member: val}

	// redis-cli SCORE is always float or int
	// SYNTAX: ZADD key SCORE MEMBER
	// ZADD contacts:username 1661360942123 contact
	err := redisClient.ZAdd(context.Background(),
		contactListZKey(username),
		zs,
	).Err()

	if err != nil {
		log.Println("error while updating contact list. username: ",
			username, "contact:", contact, err)
		return err
	}

	return nil
}

func CreateChat(c *models.Chat) (string, error) {
	chatKey := chatKey()
	fmt.Println("chat key", chatKey)

	by, _ := json.Marshal(c)

	// redis-cli
	// SYNTAX: JSON.SET key $ json_in_string
	// JSON.SET chat#1661360942123 $ '{"from": "sun", "to":"earth","message":"good morning!"}'
	res, err := redisClient.Do(
		context.Background(),
		"JSON.SET",
		chatKey,
		"$",
		string(by),
	).Result()

	if err != nil {
		log.Println("error while setting chat json", err)
		return "", err
	}

	log.Println("chat successfully set", res)

	// add contacts to both user's contact list
	err = UpdateContactList(c.From, c.To)
	if err != nil {
		log.Println("error while updating contact list of", c.From)
	}

	err = UpdateContactList(c.To, c.From)
	if err != nil {
		log.Println("error while updating contact list of", c.To)
	}

	return chatKey, nil
}

func CreateFetchChatBetweenIndex() {
	res, err := redisClient.Do(context.Background(),
		"FT.CREATE",
		chatIndex(),
		"ON", "JSON",
		"PREFIX", "1", "chat#",
		"SCHEMA", "$.from", "AS", "from", "TAG",
		"$.to", "AS", "to", "TAG",
		"$.timestamp", "AS", "timestamp", "NUMERIC", "SORTABLE",
	).Result()

	fmt.Println(res, err)
}

func FetchChatBetween(username1, username2, fromTS, toTS string) ([]models.Chat, error) {
	// redis-cli
	// SYNTAX: FT.SEARCH index query
	// FT.SEARCH idx#chats '@from:{user2|user1} @to:{user1|user2} @timestamp:[0 +inf]'
	query := fmt.Sprintf("@from:{%s|%s} @to:{%s|%s} @timestamp:[%s %s]",
		username1, username2, username2, username1, fromTS, toTS)

	res, err := redisClient.Do(context.Background(),
		"FT.SEARCH",
		chatIndex(),
		query,
		"LIMIT", "0", "100",
		"SORTBY", "timestamp", "DESC",
	).Result()

	if err != nil {
		return nil, err
	}

	// deserialise redis data to map
	data := helpers.Deserialise(res)

	// deserialise data map to chat
	chats := helpers.DeserialiseChat(data)
	return chats, nil
}

// FetchContactList of the user. It includes all the messages sent to and received by contact
// It will return a sorted list by last activity with a contact
func FetchContactList(username string) ([]models.User, error) {
	zRangeArg := redis.ZRangeArgs{
		Key:   contactListZKey(username),
		Start: 0,
		Stop:  -1,
		Rev:   true,
	}

	// redis-cli
	// SYNTAX: ZRANGE key from_index to_index REV WITHSCORES
	// ZRANGE contacts:username 0 -1 REV WITHSCORES
	res, err := redisClient.ZRangeArgsWithScores(context.Background(), zRangeArg).Result()

	if err != nil {
		log.Println("error while fetching contact list. username: ",
			username, err)
		return nil, err
	}

	contactList := helpers.DeserialiseContactList(res)

	return contactList, nil
}
