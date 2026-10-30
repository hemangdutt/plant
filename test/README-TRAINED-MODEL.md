# Plant Doctor trained model integration

The existing React UI and remedy-guide content are unchanged. The Express `/api/analyze-leaf` endpoint now prefers the trained MobileNetV2 classifier when `PLANT_MODEL_API_URL` is configured. If that service is unavailable, the app falls back to its previous Gemini/pixel-evidence flow.

## Run the model service

See [`model-service/README.md`](model-service/README.md). It uses the uploaded `best_plant_doctor.keras` model and exposes `/predict`.

## Connect the app

Set `PLANT_MODEL_API_URL` to the model service's base URL in the Express app environment. For local development, use `http://localhost:8000`.

## Important validation note

The training notebook uses PlantVillage data. Its reported validation accuracy is not a guarantee of accuracy on phone photos taken in fields. The inference service deliberately abstains for the `Other` class, softmax scores below 0.60, or top-two score margins below 0.12. These are initial safety thresholds and should be evaluated against a separate set of real field photos. The softmax score is not a calibrated probability.
