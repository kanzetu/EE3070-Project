# How to Build

## Prerequisite
- Dependancy installation
```bash
apt-get install libopencv-dev python-opencv
```

## Build
``` bash
g++ MJPEGWriter.cpp start.cpp -o MJPEG -lpthread -lopencv_highgui -lopencv_core -std=c++11
```