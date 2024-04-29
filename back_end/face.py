import os
import cv2
import face_recognition
from supabase import create_client
from dotenv import load_dotenv
import numpy as np
import requests


load_dotenv()


supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase = create_client(supabase_url, supabase_key)

if __name__ == "__main__":

    face_detector = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    
    bucket = supabase.storage.get_bucket('SnapSync Photos').list()

    #Final Image List
    result = []
    
    # Load images
    user_image = cv2.imread("user.jpeg")
    
    # Detect faces in images
    user_faces = face_detector.detectMultiScale(cv2.cvtColor(user_image, cv2.COLOR_BGR2GRAY), scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    user_face_encodings = [face_recognition.face_encodings(user_image, [(y, x+w, y+h, x)])[0] for (x, y, w, h) in user_faces]

    event_data = supabase.storage.from_('SnapSync Photos').list('Sample_Event')
    for photo in event_data:
        photo_url = supabase.storage.from_('SnapSync Photos').get_public_url('Sample_Event/%s' % photo['name'])
        
        photo_url = photo_url.split()
        photo_url = photo_url[0]+'%20'+photo_url[1]


        resp = requests.get(photo_url)
        arr = np.asarray(bytearray(resp.content), dtype=np.uint8)
        image = cv2.imdecode(arr, -1)
        
        
        faces = face_detector.detectMultiScale(cv2.cvtColor(image, cv2.COLOR_BGR2GRAY), scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
            
        # Encode faces
        face_encodings = [face_recognition.face_encodings(image, [(y, x+w, y+h, x)])[0] for (x, y, w, h) in faces]
        
        user_found = False
        for face_encoding in face_encodings:
            for user_face_encoding in user_face_encodings:
                match = face_recognition.compare_faces([user_face_encoding], face_encoding,tolerance=0.56)
                if match[0]:
                    user_found = True
                    break
            if user_found:
                break
            
        if user_found:
            result.append(photo['name'])
    
    print(result)
    
