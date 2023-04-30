package models

type UserReq struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Photo    string `json:"photo"`
	Client   string `json:"client"`
}

type Response struct {
	Status  bool        `json:"status"`
	Photo   string      `json:"photo,omitempty"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Total   int         `json:"total,omitempty"`
}
