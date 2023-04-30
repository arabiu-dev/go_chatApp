package models

type Chat struct {
	ID        string `json:"id"`
	From      string `json:"from"`
	To        string `json:"to"`
	Msg       string `json:"message"`
	Timestamp int64  `json:"timestamp"`
}

type User struct {
	Username     string `json:"username"`
	Photo        string `json:"photo"`
	LastActivity int64  `json:"last_activity"`
}
