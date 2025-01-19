## Start the server

### Install dependencies
```
pip install -r requirements.txt
```

### Run the server
- Using uvicorn
```
uvicorn app:app --reload --host 0.0.0.0 --port 9696
```
- Using Python
```
python app.py
```
- Host is defaulted to 0.0.0.0
- Port is defaulted to 9696

### Documentation
- Swagger UI
```
http://localhost:9696/docs
```

