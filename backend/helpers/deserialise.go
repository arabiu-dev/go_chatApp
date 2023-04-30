package helpers

import (
	"encoding/json"
	"log"

	"github.com/arabiu-dev/go_chatApp/models"
	"github.com/go-redis/redis/v8"
)

type Document struct {
	ID      string `json:"_id"`
	Payload []byte `json:"payload"`
	Total   int64  `json:"total"`
}

func Deserialise(res interface{}) []Document {
	switch v := res.(type) {
	case []interface{}:
		if len(v) > 1 {
			size := len(v) - 1
			var docs = make([]Document, 0, size/2)

			for i := 1; i <= size; i += 2 {
				values := v[i+1].([]interface{})
				value := values[len(values)-1].(string)

				doc := Document{
					ID:      v[i].(string),
					Payload: []byte(value),
					Total:   v[0].(int64),
				}

				docs = append(docs, doc)
			}

			return docs
		}
	default:
		log.Printf("different response type otherthan []interface{}. type: %T", res)
		return nil
	}

	return nil
}

func DeserialiseChat(docs []Document) []models.Chat {
	chats := []models.Chat{}

	for _, doc := range docs {
		var c models.Chat

		json.Unmarshal(doc.Payload, &c)
		c.ID = doc.ID
		chats = append(chats, c)
	}

	return chats
}

func DeserialiseContactList(contacts []redis.Z) []models.User {
	contactList := make([]models.User, 0, len(contacts))

	// improvement tip: use switch to get type of contact.Member
	// handle unknown type accordingly
	for _, contact := range contacts {
		var jsonMap map[string]interface{}
		json.Unmarshal([]byte(contact.Member.(string)), &jsonMap)

		contactList = append(contactList, models.User{
			Username:     jsonMap["contact"].(string),
			Photo:        jsonMap["photo"].(string),
			LastActivity: int64(contact.Score),
		})
	}

	return contactList
}
