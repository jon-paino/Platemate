from models import User, db
from flask_jwt_extended import create_access_token

def register_user(username, email, password):
    if User.query.filter_by(email=email).first() or User.query.filter_by(username=username).first():
        return {"msg": "User already exists", "status": 409}
    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return {"msg": "User registered successfully", "status": 201}

def authenticate_user(email, password):
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id)
        return {"access_token": access_token, "status": 200}
    return {"msg": "Invalid email or password", "status": 401}
