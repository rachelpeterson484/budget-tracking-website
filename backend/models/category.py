from datetime import datetime
from typing import Optional
from uuid import uuid4

class Category:
    def __init__(
        self,
        name: str,
        totalBudget: float,
        subcategories: list[str],
        id: Optional[str] = None,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None
    ):
        self.id = id or str(uuid4())
        self.name = name
        self.totalBudget = totalBudget
        self.subcategories = subcategories
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()

    def to_dict(self) -> dict:
        """Convert the transaction to a dictionary for storage or API responses."""
        return {
            "id": self.id,
            "name": self.name,
            "totalBudget": self.totalBudget,
            "subcategories": self.subcategories,
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
            created_at=datetime.fromisoformat(data["created_at"]) if data.get("created_at") else None,
            updated_at=datetime.fromisoformat(data["updated_at"]) if data.get("updated_at") else None
        )

    def update(self, **kwargs) -> None:
        """Update transaction fields and set updated_at timestamp."""
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.updated_at = datetime.utcnow() 