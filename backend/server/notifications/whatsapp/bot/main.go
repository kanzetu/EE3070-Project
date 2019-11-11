package main

import (
	"encoding/gob"
	"fmt"
	"log"
	"os"
	"os/signal"
	"io/ioutil"
	"syscall"
	"time"
	"encoding/json"
	"strings"
	
	qrcodeTerminal "github.com/Baozisoftware/qrcode-terminal-go"
	"github.com/Rhymen/go-whatsapp"	
)


type waHandler struct {
	c *whatsapp.Conn
}

type Reply struct {
	Indicater string `json:"indicater"`
	Text string `json:"text"`
	Cmd string `json:"cmd"`
}
type Replys struct {
	Replys []Reply `json:"replys"`
	Help string
}

var replyList Replys

func readJson(){
	jsonFile, _ := os.Open("./reply.json")
	fmt.Println("Successfully Opened reply.json")
	defer jsonFile.Close()
	byteValue, _ := ioutil.ReadAll(jsonFile)
	json.Unmarshal(byteValue, &replyList)
	for _, e := range replyList.Replys {
		replyList.Help += e.Indicater + "\t:\t" + e.Text + "\n"
	}
	fmt.Println("Total command =", len(replyList.Replys))
}

func index_of_json(tar string) (int, string){
	for i, e := range replyList.Replys {
		if (tar==e.Indicater){
			fmt.Println("*****CMD:",tar, "found!")
			return i,e.Text	
		}
	}
	return -1,""
}


//HandleError needs to be implemented to be a valid WhatsApp handler
func (h *waHandler) HandleError(err error) {

	if e, ok := err.(*whatsapp.ErrConnectionFailed); ok {
		log.Printf("Connection failed, underlying error: %v", e.Err)
		log.Println("Waiting 30sec...")
		<-time.After(30 * time.Second)
		log.Println("Reconnecting...")
		err := h.c.Restore()
		if err != nil {
			log.Fatalf("Restore failed: %v", err)
		}
	} else {
		log.Printf("error occoured: %v\n", err)
	}
}

//Optional to be implemented. Implement HandleXXXMessage for the types you need.
func (w *waHandler) HandleTextMessage(message whatsapp.TextMessage) {
	if int64(message.Info.Timestamp)-Now >= 0{
		tm := time.Unix(int64(message.Info.Timestamp), 8)
		fmt.Printf("%v %v %v %v\n\t%v\n", tm, message.Info.Id, message.Info.RemoteJid, message.Info.QuotedMessageID, message.Text)
		if message.Text=="/help"{
			sendMsg( message.Info.RemoteJid,"★☆★☆ From Yin Home Server ☆★☆★\nWelcome to use my Whatsapp bot" ,w.c)
			sendMsg( message.Info.RemoteJid,replyList.Help,w.c)
		}else if i,e := index_of_json(message.Text); i!=-1{
			fmt.Println(">>>>>Send '", e, "' back to",message.Info.RemoteJid)
			//sendMsg( message.Info.RemoteJid,"★☆★☆ From Yin Home Server ☆★☆★",w.c)
			sendMsg(message.Info.RemoteJid,e,w.c)
		}
	}
}

func makeTimestamp() int64 {
    return time.Now().UnixNano() / int64(time.Millisecond)
}
var Now = time.Now().UnixNano()/ int64(time.Second)
//Example for media handling. Video, Audio, Document are also possible in the same way
func (*waHandler) HandleAudioMessage(message whatsapp.AudioMessage) {
if int64(message.Info.Timestamp)-Now >= 0{
	data, err := message.Download()
	if err != nil {
		return
	}
	name := strings.Split(message.Type, "/")[1]
	filename := fmt.Sprintf("%v/%v.%v", "./media", message.Info.Id, strings.Split(name, ";")[0])
	file, err := os.Create(filename)
	defer file.Close()
	if err != nil {
		return
	}
	_, err = file.Write(data)
	if err != nil {
		return
	}
	log.Printf("%v %v\n\trecord reveived, saved at:%v\n", message.Info.Timestamp, message.Info.RemoteJid, filename)
}
}

func main() {
	readJson()
	//create new WhatsApp connection
	wac, err := whatsapp.NewConn(5 * time.Second)
	if err != nil {
		log.Fatalf("error creating connection: %v\n", err)
	}

	//Add handler
	wac.AddHandler(&waHandler{wac})

	//login or restore
	if err := login(wac); err != nil {
		log.Fatalf("error logging in: %v\n", err)
	}

	//verifies phone connectivity
	pong, err := wac.AdminTest()

	if !pong || err != nil {
		log.Fatalf("error pinging in: %v\n", err)
	}

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	<-c

	//Disconnect safe
	fmt.Println("Shutting down now.")
	session, err := wac.Disconnect()
	if err != nil {
		log.Fatalf("error disconnecting: %v\n", err)
	}
	if err := writeSession(session); err != nil {
		log.Fatalf("error saving session: %v", err)
	}
}

func login(wac *whatsapp.Conn) error {
	//load saved session
	session, err := readSession()
	if err == nil {
		//restore session
		session, err = wac.RestoreWithSession(session)
		if err != nil {
			return fmt.Errorf("restoring failed: %v\n", err)
		}
	} else {
		//no saved session -> regular login
		qr := make(chan string)
		go func() {
			terminal := qrcodeTerminal.New()
			terminal.Get(<-qr).Print()
		}()
		session, err = wac.Login(qr)
		if err != nil {
			return fmt.Errorf("error during login: %v\n", err)
		}
	}

	//save session
	err = writeSession(session)
	if err != nil {
		return fmt.Errorf("error saving session: %v\n", err)
	}
	return nil
}

func sendMsg(jid string, text string, wac *whatsapp.Conn){
	msg := whatsapp.TextMessage{
		Info: whatsapp.MessageInfo{
			RemoteJid: jid,
		},
		Text: text,
	}

	msgId,err := wac.Send(msg)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error sending message: %v", err)
		os.Exit(1)		
	} else {
		fmt.Println("Message Sent -> ID : "+msgId)
	}
}

func readSession() (whatsapp.Session, error) {
	session := whatsapp.Session{}
	file, err := os.Open("./whatsappSession.gob")
	if err != nil {
		return session, err
	}
	defer file.Close()
	decoder := gob.NewDecoder(file)
	err = decoder.Decode(&session)
	if err != nil {
		return session, err
	}
	return session, nil
}

func writeSession(session whatsapp.Session) error {
	file, err := os.Create("./whatsappSession.gob")
	if err != nil {
		return err
	}
	defer file.Close()
	encoder := gob.NewEncoder(file)
	err = encoder.Encode(session)
	if err != nil {
		return err
	}
	return nil
}
