from darkflow.net.build import TFNet
import cv2
import sys
import os 

print(os.getcwd())
os.chdir("/home/user/projects/cv/dark/darkflow");

options = {"model": "/home/user/projects/cv/dark/darkflow/cfg/yolo.cfg", "load": "/home/user/projects/cv/dark/darkflow/bin/yolo.weights", "threshold": 0.1}

tfnet = TFNet(options)

imgcv = cv2.imread(sys.argv[1])
result = tfnet.return_predict(imgcv)
print(result)
