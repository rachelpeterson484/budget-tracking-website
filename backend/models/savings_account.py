from datetime import datetime
from typing import Optional
from uuid import uuid4

class SavingsAccount:
    def __init__(
        self,
        name: str,
        amount: float,
        goal: float,
        id: Optional[str] = None,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None
    ):
        self.id = id or str(uuid4())
        self.name = name
        self.amount = amount
        self.goal = goal
        self.difference = goal - amount
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()

    def to_dict(self) -> dict:
        """Convert the savings account to a dictionary for storage or API responses."""
        return {
            "id": self.id,
            "name": self.name,
            "amount": self.amount,
            "goal": self.goal,
            "difference": self.difference,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'SavingsAccount':
        """Create a SavingsAccount instance from a dictionary."""
        return cls(
            id=data.get("id"),
            name=data["name"],
            amount=data["amount"],
            goal=data["goal"],
            created_at=datetime.fromisoformat(data["created_at"]) if data.get("created_at") else None,
            updated_at=datetime.fromisoformat(data["updated_at"]) if data.get("updated_at") else None
        )

    def update(self, **kwargs) -> None:
        """Update savings account fields and set updated_at timestamp."""
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.updated_at = datetime.utcnow() 