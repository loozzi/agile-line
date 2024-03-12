"""add table label

Revision ID: 17d2fbaf8a65
Revises: a092178717ae
Create Date: 2024-03-11 17:12:38.248806

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '17d2fbaf8a65'
down_revision = 'a092178717ae'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('label',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('workspace_id', sa.Integer(), nullable=False),
    sa.Column('color', sa.String(length=8), nullable=False),
    sa.Column('title', sa.String(length=1024), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('create_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
    sa.Column('updated_at', sa.TIMESTAMP(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['workspace_id'], ['workspace.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('label')
    # ### end Alembic commands ###
