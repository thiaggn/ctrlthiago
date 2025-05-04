package main

import (
	"net/http"
	"os"
)

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Cabeçalhos CORS permissivos
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Trata pré-flight request
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	var r = http.NewServeMux()

	cols, err := os.ReadFile("col-headers.json")
	if err != nil {
		panic("")
	}

	col, err := os.ReadFile("col-100000.json")
	if err != nil {
		panic("")
	}

	post, err := os.ReadFile("post-203030.json")
	if err != nil {
		panic("")
	}

	r.HandleFunc("GET /api/v1/collections", func(w http.ResponseWriter, request *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write(cols)
	})
	r.HandleFunc("GET /api/v1/collections/100000", func(w http.ResponseWriter, request *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write(col)
	})
	r.HandleFunc("GET /api/v1/posts/203030", func(w http.ResponseWriter, request *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write(post)
	})

	var s = &http.Server{
		Addr:    ":8080",
		Handler: withCORS(r), // Aplica CORS
	}

	s.ListenAndServe()
}
