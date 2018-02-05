from darkflow.net.build import TFNet
import cv2
import sys
import os 

print(os.getcwd())
os.chdir("/home/user/projects/cv/dark/darkflow");

options = {"model": "/home/user/projects/cv/dark/darkflow/cfg/yolo.cfg", "load": "/home/user/projects/cv/dark/darkflow/bin/yolo.weights", "threshold": 0.1}

tfnet = TFNet(options)

image_path = sys.argv[1]
last_slash = image_path.rfind('/')
output_path = image_path[:last_slash] + '/out' + image_path[last_slash:]

print(output_path)

imgcv = cv2.imread(image_path)
result, boxes = tfnet.return_predict(imgcv)

h, w, _ = imgcv.shape

print(boxes)

for box in boxes:
	left, right, top, bot, mess, max_indx, confidence = box
	thick = int((h + w) // 300)
	
	cv2.rectangle(imgcv,
			(left, top), (right, bot),
			(124,252,0), thick)

	cv2.putText(
		imgcv, mess, (left, top - 12),
		0, 1e-3 * h, (124,252,0),
		thick // 3)


cv2.imwrite(output_path, imgcv)

print(result)
