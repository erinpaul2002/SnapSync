import os
import cv2
import face_recognition
from flask import Flask,request,jsonify

app = Flask(__name__)

face_detector = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

@app.route('/find_user', methods=['POST'])

def search_user():
    user_image = request.files['user_image']
    user_image.save('user.jpeg')
    
    #Final Image List
    result = []
    
    # Load images
    user_image = cv2.imread("user.jpeg")


    # Detect faces in images
    user_faces = face_detector.detectMultiScale(cv2.cvtColor(user_image, cv2.COLOR_BGR2GRAY), scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    user_face_encodings = [face_recognition.face_encodings(user_image, [(y, x+w, y+h, x)])[0] for (x, y, w, h) in user_faces]
    
    for filename in os.listdir("photos"):
        if filename.endswith("jpeg") or filename.endswith("jpg") or filename.endswith("png"):
            
            image = cv2.imread(os.path.join("photos",filename))
            faces = face_detector.detectMultiScale(cv2.cvtColor(image, cv2.COLOR_BGR2GRAY), scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
            
        # Encode faces
        face_encodings = [face_recognition.face_encodings(image, [(y, x+w, y+h, x)])[0] for (x, y, w, h) in faces]
        
        user_found = False

        for face_encoding in face_encodings:
            for user_face_encoding in user_face_encodings:
                match = face_recognition.compare_faces([user_face_encoding], face_encoding,tolerance=0.6)
                if match[0]:
                    user_found = True
                    break
            if user_found:
                break
            
        if user_found:
            result.append(filename)
    return jsonify(result)
    
if __name__ == "__main__":
    app.run(debug = True)