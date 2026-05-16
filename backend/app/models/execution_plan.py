from database import Base  # Or however Base is imported in your project structure
from sqlalchemy import Column, Integer, Text, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship

class ExecutionPlan(Base):
    # Set the exact table name as required
    __tablename__ = 'execution_plans'

    # Primary Key, Auto Increment
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Foreign Key pointing to design_requests.id 
    # enforced with UNIQUE constraint to ensure 1:1 relationship (One Design Request can have one Execution Plan)
    request_id = Column(Integer, ForeignKey('design_requests.id', ondelete='CASCADE'), unique=True, nullable=False)
    
    # Foreign Key pointing to users.id (One Designer can create multiple Execution Plans - 1:N)
    designer_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    # Description of the design layout
    layout_description = Column(Text, nullable=True)
    
    # Additional notes from the designer
    notes = Column(Text, nullable=True)
    
    # Status column with a default value set to 'draft'
    status = Column(Text, server_default='draft', nullable=False)

    # Table constraints to restrict status values to: draft, published, or completed
    __table_args__ = (
        CheckConstraint(status.in_(['draft', 'published', 'completed']), name='check_status_values'),
    )

    # SQLAlchemy Relationships for easier data fetching (Optional but recommended)
    request = relationship("DesignRequest", back_populates="execution_plan")
    designer = relationship("User", back_populates="execution_plans")
