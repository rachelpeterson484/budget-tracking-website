from datetime import datetime
from typing import Optional
from uuid import uuid4

class Transaction:
    def __init__(
        self,
        amount: float,
        date: datetime,
        category: str,
        subcategory: str,
        budget_id: str,
        description: Optional[str] = None,
        payment_method: Optional[str] = None,
        transaction_type: str = "expense",  # "expense" or "income"
        id: Optional[str] = None,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None
    ):
        self.id = id or str(uuid4())
        self.amount = amount
        self.date = date
        self.category = category
        self.subcategory = subcategory
        self.budget_id = budget_id
        self.description = description
        self.payment_method = payment_method
        self.transaction_type = transaction_type
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()

    def to_dict(self) -> dict:
        """Convert the transaction to a dictionary for storage or API responses."""
        return {
            "id": self.id,
            "amount": self.amount,
            "date": self.date.isoformat(),
            "category": self.category,
            "subcategory": self.subcategory,
            "budget_id": self.budget_id,
            "description": self.description,
            "payment_method": self.payment_method,
            "transaction_type": self.transaction_type,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'Transaction':
        """Create a Transaction instance from a dictionary."""
        return cls(
            id=data.get("id"),
            amount=data["amount"],
            date=datetime.fromisoformat(data["date"]),
            category=data["category"],
            subcategory=data["subcategory"],
            budget_id=data["budget_id"],
            description=data.get("description"),
            payment_method=data.get("payment_method"),
            transaction_type=data.get("transaction_type", "expense"),
            created_at=datetime.fromisoformat(data["created_at"]) if data.get("created_at") else None,
            updated_at=datetime.fromisoformat(data["updated_at"]) if data.get("updated_at") else None
        )

    def update(self, **kwargs) -> None:
        """Update transaction fields and set updated_at timestamp."""
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.updated_at = datetime.utcnow() 