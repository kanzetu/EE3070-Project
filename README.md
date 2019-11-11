# EE3070-Project

## Server side setup
### Datebase
- #### Prerequisites
```
MySQL>=5.7
```
- #### Setup
- Clone the repositoriey
``` bash
git clone https://github.com/kanzetu/EE3070-Project
cd EE3070-Project
```

- Initializing the database
``` bash
mysql -uroot < backend/server/mysql/00.setup.sql
mysql -uroot < backend/server/mysql/01.office.sql
```

### Web application
- #### Prerequisites
```
Node.js
```
- #### Setup
``` bash
cd webapp
npm i
cd -
```

### Notifications system
Sending message via Whatsapp and Email
- #### Prerequisites
````
golang
````
- #### Setup
- Whatsapp bot
```bash
cd backend/server/notifications/whatsapp/bot
export GOPATH=`pwd`
go get "github.com/Baozisoftware/qrcode-terminal-go"
go get "github.com/Rhymen/go-whatsapp"
go build main
cd -
```

___

## Embedded system setup
### Smart Door Lock
- #### Prerequisites
- [Dietpi](https://github.com/MichaIng/DietPi)
- [dlib C++](https://github.com/davisking/dlib)
- [OpenCV](https://github.com/opencv/opencv)

- #### Setup

``` bash
apt install git build-essential libopencv-dev python-opencv ## Install dependances
git clone https://github.com/davisking/dlib && cd dlib ## Clone dlib
mkdir build; cd build; cmake .. ; cmake --build . ; sudo make install ## build dlib
cd - ; rm -rf dlib ## Clean up

git clone https://github.com/kanzetu/EE3070-Project backend/embedded_sys/smartDoorLock
cd backend/embedded_sys/smartDoorLock/face_recogn/src
```

- #### Build

```bash
g++ MJPEGWriter.cpp start.cpp -o face_recogn -lpthread `pkg-config --cflags --libs opencv` -Wall -O0 -g3 `pkg-config --cflags --libs dlib-1`
```
