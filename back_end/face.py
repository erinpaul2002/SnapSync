import os
from flask import Flask, request, jsonify
import cv2
import face_recognition
from supabase import create_client
from dotenv import load_dotenv
import numpy as np
import requests
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase = create_client(supabase_url, supabase_key)

UPLOAD_FOLDER = './back_end/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/find-matches', methods=['POST'])
def find_matches():
    image_url = request.json.get('imageUrl')
    event_name = request.json.get('eventName', 'Sample_Event')  # Default event name if not provided

    if not image_url:
        return jsonify({'error': 'No image URL provided'}), 400

    try:
        response = requests.get(image_url)
        if response.status_code != 200:
            return jsonify({'error': 'Failed to fetch image from URL'}), 400

        array = np.asarray(bytearray(response.content), dtype=np.uint8)
        user_image = cv2.imdecode(array, cv2.IMREAD_COLOR)
        if user_image is None:
            return jsonify({'error': 'Failed to decode image'}), 400
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

    face_detector = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    user_faces = face_detector.detectMultiScale(cv2.cvtColor(user_image, cv2.COLOR_BGR2GRAY), scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    user_face_encodings = [face_recognition.face_encodings(user_image, [(y, x+w, y+h, x)])[0] for (x, y, w, h) in user_faces if len(face_recognition.face_encodings(user_image, [(y, x+w, y+h, x)])) > 0]

    result = []
    
    # Retrieve photos from the specified event in Supabase
    event_data = supabase.storage.from_('SnapSync Photos').list(event_name)
    
    for photo in event_data:
        try:
            photo_url = supabase.storage.from_('SnapSync Photos').get_public_url(f'{event_name}/{photo['name']}')
            resp = requests.get(photo_url)
            arr = np.asarray(bytearray(resp.content), dtype=np.uint8)
            image = cv2.imdecode(arr, -1)
            
            faces = face_detector.detectMultiScale(cv2.cvtColor(image, cv2.COLOR_BGR2GRAY), scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
            face_encodings = [face_recognition.face_encodings(image, [(y, x+w, y+h, x)])[0] for (x, y, w, h) in faces if len(face_recognition.face_encodings(image, [(y, x+w, y+h, x)])) > 0]
            
            user_found = False
            for face_encoding in face_encodings:
                matches = face_recognition.compare_faces(user_face_encodings, face_encoding, tolerance=0.56)
                if True in matches:
                    user_found = True
                    break
            if user_found:
                result.append(photo['name'])
        except Exception as e:
            print("Error processing photo:", e)
            continue

    return jsonify({'matching_images': result})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
