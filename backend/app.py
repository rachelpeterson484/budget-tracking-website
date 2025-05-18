from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
from models import db, Category, Subcategory, Transaction
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///budget.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

# Create tables
with app.app_context():
    db.create_all()

# Configure CORS
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    try:
        transactions = Transaction.query.all()
        return jsonify([t.to_dict() for t in transactions])
    except Exception as e:
        logger.error(f"Error getting transactions: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/transactions', methods=['POST'])
def create_transaction():
    try:
        data = request.get_json()
        
        # Find or create category and subcategory
        category = Category.query.filter_by(name=data['category']).first()
        if not category:
            category = Category(name=data['category'])
            db.session.add(category)
            db.session.commit()
        
        subcategory = Subcategory.query.filter_by(
            name=data['subcategory'],
            category_id=category.id
        ).first()
        if not subcategory:
            subcategory = Subcategory(name=data['subcategory'], category=category)
            db.session.add(subcategory)
            db.session.commit()
        
        # Create transaction
        transaction = Transaction(
            description=data['description'],
            amount=data['amount'],
            date=datetime.fromisoformat(data['date']),
            recurring_date=datetime.fromisoformat(data['recurring_date']) if data.get('recurring_date') else None,
            subcategory=subcategory
        )
        
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify(transaction.to_dict()), 201
    except Exception as e:
        logger.error(f"Error creating transaction: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/categories', methods=['GET'])
def get_categories():
    try:
        categories = Category.query.all()
        return jsonify([{
            'id': c.id,
            'name': c.name,
            'subcategories': [{'id': s.id, 'name': s.name} for s in c.subcategories]
        } for c in categories])
    except Exception as e:
        logger.error(f"Error getting categories: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)