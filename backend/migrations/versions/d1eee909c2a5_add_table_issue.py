"""add table issue

Revision ID: d1eee909c2a5
Revises: 7d0bbc050673
Create Date: 2024-03-12 00:43:58.541083

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd1eee909c2a5'
down_revision = '7d0bbc050673'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('issue',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('project_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=1024), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('status', sa.Enum('BACKLOG', 'TODO', 'INPROGRESS', 'DONE', 'DUPLICATE', 'CANCELLED', name='issuestatus'), nullable=False),
    sa.Column('priority', sa.Enum('HIGH', 'MEDIUM', 'LOW', 'URGEN', 'NOPRIORITY', name='issuepriority'), nullable=False),
    sa.Column('assignee_id', sa.Integer(), nullable=False),
    sa.Column('assignor_id', sa.Integer(), nullable=False),
    sa.Column('testor_id', sa.Integer(), nullable=False),
    sa.Column('milestone_id', sa.Integer(), nullable=True),
    sa.Column('permalink', sa.String(length=256), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
    sa.Column('updated_at', sa.TIMESTAMP(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['assignee_id'], ['user.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['assignor_id'], ['user.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['project_id'], ['project.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['testor_id'], ['user.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('permalink')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('issue')
    # ### end Alembic commands ###