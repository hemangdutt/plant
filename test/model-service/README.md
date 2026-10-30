# Plant Doctor trained-model inference service

This service loads `best_plant_doctor.keras` and exposes `/predict` for the Express app.

## Run locally

Python 3.11 is recommended. From this directory:

```bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```

Check `http://localhost:8000/health`.

## Deploy

Build this directory as a Docker service (for example, on a container host). Set the service's public HTTPS URL as `PLANT_MODEL_API_URL` in the Plant Doctor Express app. The app will then prefer this trained model for uploaded photos. Keep the model service URL private to trusted app infrastructure where possible, and add authentication/rate limiting before public production use.

## Model contract

- Input: JSON `{ "imageBase64": "..." }` (raw base64 or data URL)
- Image: EXIF-corrected, RGB, resized to 224x224
- Preprocessing: `tf.keras.applications.mobilenet_v2.preprocess_input`, matching the training notebook's [-1, 1] scaling
- Output classes, in exact order: `Healthy`, `Rusty`, `Powdery`, `Other`
- `Other`, low confidence (< 0.60), or a small top-two margin (< 0.12) returns `uncertain: true`; it is never mapped to Healthy.

The confidence and margin cutoffs are conservative starting values, not clinically/agronomically validated thresholds. Tune them using a representative field-photo validation set before real deployment.
