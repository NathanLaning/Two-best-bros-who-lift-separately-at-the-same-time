## TODO: lock this version down at some point
FROM golang:1.23
WORKDIR /app
COPY code/. ./
RUN go get github.com/lib/pq
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o /helloWorld.go
EXPOSE 8080
CMD ["/helloWorld.go"]