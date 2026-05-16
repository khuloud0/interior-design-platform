from database import db  # Matches 'from database import db' seen in your __init__.py
from sqlalchemy import Column, Integer, Text, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship

class ExecutionStep(db.Model):
    # Set the exact table name as required
    __tablename__ = 'execution_steps'

    # Primary Key, Auto Increment
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Foreign Key pointing to execution_plans.id (1:N relationship)
    plan_id = Column(Integer, ForeignKey('execution_plans.id', ondelete='CASCADE'), nullable=False)
    
    # Foreign Key pointing to users.id (1:N relationship)
    designer_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    # Description of this specific step
    description = Column(Text, nullable=False)
    
    # Additional notes (optional, accepts null)
    notes = Column(Text, nullable=True)
    
    # Order of the step to sort correctly
    step_order = Column(Integer, nullable=False)
    
    # Status column with a default value set to 'pending'
    status = Column(Text, server_default='pending', nullable=False)

    # Table constraints to restrict status values to: pending, in_progress, or completed
    __table_args__ = (
        CheckConstraint(status.in_(['pending', 'in_progress', 'completed']), name='check_step_status_values'),
    )

    # SQLAlchemy Relationships for seamless data fetching
    plan = relationship("ExecutionPlan", back_populates="steps")
    designer = relationship("User", back_populates="execution_steps")
