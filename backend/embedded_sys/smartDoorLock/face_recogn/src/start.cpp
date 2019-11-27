#include "MJPEGWriter.h"

#include <dlib/opencv.h>
#include <dlib/image_processing/frontal_face_detector.h>
#include <dlib/image_processing/render_face_detections.h>
#include <dlib/image_processing.h>
#include <dlib/image_transforms.h>
#include <dlib/gui_widgets.h>
using namespace dlib;

int main(int argc, char** argv)
{
    int port = 7776;
    int FACE_DOWNSAMPLE_RATIO = 3;
    int SKIP_FRAMES = 10;
    int opt;
    const char *optstring = "p:r:s:"; 
    while ((opt = getopt(argc, argv, optstring)) != -1) {
        switch (opt) {
            case 'p':
                port = atoi(optarg);
                break;
            case 'r':
                FACE_DOWNSAMPLE_RATIO = atoi(optarg);
                break;
            case 's':
                SKIP_FRAMES = atoi(optarg);
                break;
            case '?':
                printf("error optopt: %c\n", optopt);
                printf("error opterr: %d\n", opterr);
                break;
        }
    }
    
    
    MJPEGWriter test(port); //Creates the MJPEGWriter class to stream on the given port
    
    cv::VideoCapture cap;
    bool ok = cap.open(0); //Opens webcam
    
    
    frontal_face_detector detector = get_frontal_face_detector();
    
    if (!ok)
    {
        printf("no cam found ;(.\n");
        pthread_exit(NULL);
    }
    cv::Mat im,im_small;
    cap >> im;
    int count = 0;
    
    test.write(im); //Writes a frame (Mat class from OpenCV) to the server
    im.release();
    test.start(); //Starts the HTTP Server on the selected port
    while(cap.isOpened()){
        cap >> im; 
        cv::resize(im, im_small, cv::Size(), 1.0/FACE_DOWNSAMPLE_RATIO, 1.0/FACE_DOWNSAMPLE_RATIO);
        cv_image<bgr_pixel> cimg_small(im_small);
        cv_image<bgr_pixel> cimg(im);
        std::vector<full_object_detection> shapes;
        
        if ( count % SKIP_FRAMES == 0 ){
            std::vector<rectangle> faces = detector(cimg_small);
            for (unsigned long i = 0; i < faces.size(); ++i){
                cv::Point pt1(faces[i].left() * FACE_DOWNSAMPLE_RATIO, faces[i].top() * FACE_DOWNSAMPLE_RATIO);
                cv::Point pt2(faces[i].right() * FACE_DOWNSAMPLE_RATIO, faces[i].bottom() * FACE_DOWNSAMPLE_RATIO);
                cv::rectangle(im, pt1, pt2, cv::Scalar(0, 255, 0));
            }
        }


        
        test.write(im); 
        im.release();
    }
    test.stop(); //Stops the HTTP Server
    exit(0);
}
